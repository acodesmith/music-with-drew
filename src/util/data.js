import moment from 'moment';

export const normalizeData = (data) => {
	return data.map(({node}) => {

		const {id, band: artist, date, venue, city: location} = node;

		const [city = '', state = ''] = location.split(",");

		return {
			_date: date,
			location,
			id,
			artist,
			venue,
			date: moment(date, "MM/D/YYYY"),
			city: city,
			state: state.trim()
		}
	});
}