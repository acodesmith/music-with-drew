import moment from "moment";
import Dexie from "dexie";
import { parse } from "csv";

const DB_NAMESPACE = "MusicWithYou";

export const normalizeData = (data) => {
  return data.map((item) => {
    // Support GraphQL Query of IndexDB
    const baseItem = item.node || item;

    // Pull apart data
    const { id, band: artist, date, venue, city: location } = baseItem;

    const [city = "", state = ""] = location ? location.split(",") : [];

    return {
      _date: date,
      location,
      id,
      artist,
      venue,
      date: moment(date, "MM/D/YYYY"),
      city: city,
      state: state.trim(),
    };
  });
};

/**
 * Convert csv file from local filesystem into IndexDB
 * @param file
 * @returns {Promise.<void>}
 */
export const processCsvFromUpload = async (file) => {
  await new Promise((resolve) => {
    const reader = new FileReader();

    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      parseCsvText(reader.result).then(async (shows) => {
        // Delete old data on new upload
        await Dexie.delete(DB_NAMESPACE);

        const db = await getDb();
        await db.shows.bulkAdd(shows);

        resolve(shows);
      });
    };
    reader.readAsText(file);
  });
};

/**
 * Convert csv as string into IndexDB
 * @param textFromS3File - string
 * @returns {Promise}
 */
export const processCsvFromAws = (textFromS3File) => {
  return new Promise((resolve) => {
    parseCsvText(textFromS3File).then(async (shows) => {
      // Delete old data on new upload
      await Dexie.delete(DB_NAMESPACE);

      const db = await getDb();
      await db.shows.bulkAdd(shows);

      resolve(shows);
    });
  });
};

export const parseCsvText = (csvAsText) => {
  return new Promise((resolve, reject) => {
    parse(csvAsText, {}, async (err, output) => {
      if (err) {
        // @todo handle error
        console.error(err);
        reject(err);
      }

      // If headers - remove
      if (output[0][0] === "band") {
        delete output[0];
      }

      const shows = output
        .filter((o) => o)
        .map(([band, venue, date, city], id) => ({
          id: id + 1,
          band,
          venue,
          date,
          city,
        }));

      resolve(shows);
    });
  });
};

/**
 * IndexDb instance with indexed fields
 * @returns {Promise<Dexie>}
 */
export const getDb = async () => {
  const db = new Dexie(DB_NAMESPACE);

  // Declare tables, IDs and indexes
  await db.version(1).stores({
    shows: "id,band,venue,date,location",
  });

  return db;
};

/**
 * Get local IndexDb data
 * @returns {Promise.<*>}
 */
export const getLocalData = async () => {
  const db = await getDb();

  if (!db.shows) {
    return false;
  }

  return await db.shows.toArray();
};

/**
 * Delete the IndexDb data
 * @returns {Promise.<boolean>}
 */
export const clearLocalData = async () => {
  // Delete old data on new upload
  await Dexie.delete(DB_NAMESPACE);

  await getDb();

  return true;
};

/**
 * Generate random file name for s3 and url sharing.
 * @param length
 * @returns {string}
 */
export const makeFileName = (length = 20) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
