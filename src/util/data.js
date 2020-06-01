import moment from "moment";
import Dexie from "dexie";
import { parse } from "csv";

const DB_NAMESPACE = "MusicWithYou";

export const normalizeData = data => {
	return data.map(item => {
		console.log("item",item);
		const { id, band: artist, date, venue, city: location } = item;

		const [city = "", state = ""] = location.split(",");

		return {
			_date: date,
			location,
			id,
			artist,
			venue,
			date: moment(date, "MM/D/YYYY"),
			city: city,
			state: state.trim()
		};
	})
};

export const processCsv = async file => {
  const reader = new FileReader();

  reader.onabort = () => console.log("file reading was aborted");
  reader.onerror = () => console.log("file reading has failed");
  reader.onload = () => {
    parse(reader.result, {}, async (err, output) => {
      if (err) {
        // @todo handle error
        console.error(err);
        return;
      }

      // If headers - remove
      if (output[0][0] === "band") {
        delete output[0];
      }

      const shows = output
        .filter(o => o)
        .map(([band, venue, date, city], id) => ({
          id: id + 1,
          band,
          venue,
          date,
					city
        }));

      // Delete old data on new upload
			await Dexie.delete(DB_NAMESPACE);

      const db = await getDb();
      await db.shows.bulkAdd(shows);

      return true;
    });
  };
  reader.readAsText(file);
};

export const getDb = async () => {
	const db = new Dexie(DB_NAMESPACE);

	// Declare tables, IDs and indexes
	db.version(1).stores({
		shows: "id,band,venue,date,location"
	});

  return db;
};

export const getLocalData = async () => {
	const db = await getDb();

	if(!db.shows) {
		return false;
	}

	return await db.shows.toArray();
}