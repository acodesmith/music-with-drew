import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGuitar, faUserAstronaut, faCity, faMapMarkedAlt, faAward, faCalendarAlt} from '@fortawesome/free-solid-svg-icons'
import './index.css';

const normalizeData = (data) => {
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

const groupData = (data) => {
	const cities = _.groupBy(data, "city")
	const states = _.groupBy(data, "state")
	const artist = _.groupBy(data, "artist")
	const artistSorted = Object.keys(artist)
		.map(function (k) {
			return {key: k, value: artist[k]};
		})
		.sort(function (a, b) {
			return b.value.length - a.value.length;
		});

	return {
		cities,
		states,
		artist: artistSorted
	}
}

const IndexPage = ({data: rawData}) => {
	const data = normalizeData(rawData.allAttendedCsv.edges);
	const {cities, states, artist} = groupData(data);

	const metrics = [
		{title: 'Shows', value: data.length, icon: faGuitar, iconColor: '#FFC107'},
		{title: 'Artist', value: Object.keys(artist).length, icon: faUserAstronaut, iconColor: '#FF5722'},
		{title: 'Cities', value: Object.keys(cities).length, icon: faCity, iconColor: '#4CAF50'},
		{title: 'States', value: Object.keys(states).length, icon: faMapMarkedAlt, iconColor: '#E91E63'},
	]

	return (
		<div className="bg-gray-100 min-h-screen ">
			<div className="container mx-auto max-w-screen-md">
				<h2 className="text-5xl text-blue-900 pt-6 ml-2">Drew love️s music.</h2>
				<h2 className="text-3xl text-blue-400 pb-3 text-opacity-50 ml-2">I mean he <em>really</em> loves music.</h2>
				<div className={'flex flex-wrap'}>
					{metrics.map(({title, value, icon, iconColor}) => (
						<div
							key={`${title}-${value}`}
							className="mx-1 my-3 max-w-sm flex p-6 bg-white rounded-lg shadow-xl flex-grow"
						>
							<FontAwesomeIcon icon={icon} size={'3x'} color={iconColor}/>
							<div className="flex flex-col ml-6 pt-1">
								<h4 className="text-2xl text-gray-900 leading-tight mr-2">{value}</h4>
								<p className="text-base text-gray-600 leading-normal">{title}</p>
							</div>
						</div>
					))}
				</div>
				{/*<Chart data={graphData} series={series} axes={axes} tooltip />*/}
				<div className="md:grid md:grid-flow-col block">
					<div className="mx-1 my-3 max-w-xl flex p-6 bg-white rounded-lg shadow-xl">
						<h4 className="max-w-sm w-56 text-center">
							<span className="text-5xl text-gray-700 leading-tight">Top 5</span><br/>
							<span className="text-sm text-gray-500">by shows attendance</span>
						</h4>
						<ol className="pl-10 w-full">
							{(() => {
								let temp = artist;
								temp = temp.splice(0, 5);

								return temp.map((data, index) => (
									<li key={data.key} className={`flex w-full ${index === 0 ? 'text-xl' : ''}`}>
										<div className="text-grey-500">{data.key}</div> <div className="ml-auto text-grey-800">{data.value.length} times</div>
									</li>
								))
							})()}
						</ol>
					</div>
					<div className="mx-1 my-3 max-w-md p-6 bg-white rounded-lg shadow-xl">
						<h3 className="text-lg mb-3">Have you been to a show with Drew?</h3>
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
							Search
						</button>
					</div>
				</div>
				<div className="flex">
					<div className="mx-1 my-3 max-w-sm flex p-6 bg-white rounded-lg shadow-xl flex-grow"
					>
						<FontAwesomeIcon icon={faAward} size={'3x'}/>
						<div className="flex flex-col ml-6 pt-1">
							<h3>
								The first show Drew ever saw: <br/>
								<small>{(() => {

									const {artist, date, venue, location} = data[0]

									window.t = date;
									return `${artist} on ${date.format('dddd MMMM Do YYYY')} at ${venue} in ${location}`
								})()}</small>
							</h3>
						</div>
					</div>
					<div className="mx-1 my-3 max-w-sm flex p-6 bg-white rounded-lg shadow-xl flex-grow"
					>
						<FontAwesomeIcon icon={faCalendarAlt} size={'3x'}/>
						<div className="flex flex-col ml-6 pt-1">
							<h3>
								Most recent show Drew has seen: <br/>
								<small>{(() => {

									const {artist, date, venue, location} = data.slice(-1)[0]

									return `${artist} on ${date.format('dddd MMMM Do YYYY')} at ${venue} in ${location}`
								})()}</small>
							</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default IndexPage

export const query = graphql`
{
  allAttendedCsv {
    edges {
      node {
        id
        band
        city
        date
        venue
      }
    }
  }
}
`