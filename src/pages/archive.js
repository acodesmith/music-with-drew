import { graphql } from 'gatsby';
import React, { useMemo, useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import { useDebouncedCallback } from 'use-debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import { normalizeData } from "../util/data";
import { Footer } from "../components/Footer";
import { theme } from "../util/theme";
import './index.css';

function Table({ columns, data }) {
	// Use the state and functions returned from useTable to build your UI
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({
		columns,
		data,
	}, useSortBy)

	// Render the UI for your table
	return (
		<table className="table-auto w-full" {...getTableProps()}>
			<thead>
			{headerGroups.map(headerGroup => (
				<tr {...headerGroup.getHeaderGroupProps()}>
					{headerGroup.headers.map(column => (
						// Add the sorting props to control sorting. For this example
						// we can add them into the header props
						<th className={`${theme('bg-blue-100', 'bg-blue-900')} border-solid border-2 border-gray-300 border-t-0 border-l-0 border-r-0 sticky top-0 px-2 py-1 ${column.className ? column.className : ''}`}
								{...column.getHeaderProps(column.getSortByToggleProps())}
						>
							{column.render('Header')}
							{/* Add a sort direction indicator */}
							<span>
									{column.isSorted
										? column.isSortedDesc
											? <span className="ml-1"><FontAwesomeIcon color={'#0d567d'} icon={faArrowCircleDown} /></span>
											: <span className="ml-1"><FontAwesomeIcon color={'#0d567d'} icon={faArrowCircleUp} /></span>
										: ''}
								</span>
						</th>
					))}
				</tr>
			))}
			</thead>
			<tbody {...getTableBodyProps()}>
			{rows.map(
				(row, i) => {
					prepareRow(row);
					return (
						<tr className={i % 2 === 0 ? theme('bg-gray-100', 'bg-gray-800') : ''} {...row.getRowProps()}>
							{row.cells.map((cell, index) => {
								return (
									<td
										className={`${theme('border-gray-200', 'border-gray-600')} border px-2 py-1 ${index === 0 ? 'border-l-0' : ''} ${index === (row.cells.length - 1) ? 'border-r-0' : ''}`}
										{...cell.getCellProps()}
									>
										{cell.render('Cell')}
									</td>
								)
							})}
						</tr>
					)}
			)}
			</tbody>
		</table>
	)
}

const ArchivePage = ({ data: rawData }) => {
	const data = useMemo(() => {
		const n = normalizeData(rawData.allAttendedCsv.edges);
		return n.map(data => ({
			...data,
			date: data.date.unix()
		}))
	}, []);
	const [filtered, setFilter] = useState(data);

	const columns = useMemo(
		() => [
			{
				Header: 'Artist',
				accessor: 'artist'
			},
			{
				Header: 'Venue',
				accessor: 'venue'
			},
			{
				Header: 'Date',
				accessor: 'date',
				Cell: ({ row: { original } }) => {
					return moment.unix(original.date).format('MM/DD/YYYY')
				}
			},
			{
				Header: 'City',
				accessor: 'city',
			},
			{
				Header: 'State',
				accessor: 'state',
				className: 'w-24'
			},
		],
		[]
	);

	// Debounce callback
	const [debouncedCallback] = useDebouncedCallback(
		// function
		(value) => {
			console.log("value",value);
			if(!value || value === "") {
				setFilter(data);
				return;
			}
			setFilter(data.filter(d =>
				d.venue.toLowerCase().indexOf(value.toLowerCase()) > -1
				|| d.artist.toLowerCase().indexOf(value.toLowerCase()) > -1
				|| d.city.toLowerCase().indexOf(value.toLowerCase()) > -1
				|| d.state.toLowerCase().indexOf(value.toLowerCase()) > -1
			))
		},
		// delay in ms
		30
	);

	return (
		<>
		<div className={`${theme('bg-gray-100', 'bg-gray-800')} min-h-screen`}>
			<div className="container flex flex-col mx-auto max-w-screen-md max-h-screen pt-4">
				<h2 className={`${theme('text-blue-900', 'text-blue-100')} text-5xl pt-6 ml-2`}>Drew love️s music.</h2>
				<h2 className={`${theme('text-blue-400', 'text-blue-200')} text-3xl pb-3 text-opacity-50 ml-2`}>The Archive</h2>
				<input
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
					id="mwdSearch"
					type="text"
					placeholder="Search"
					onChange={(e) => debouncedCallback(e.target.value)}
				/>
				<div className={`${theme('text-black', 'text-gray-100')} ${theme('bg-white', 'bg-gray-700')}  rounded-lg shadow-xl flex-auto overflow-scroll mb-3`}>
					<Table data={filtered} columns={columns} />
				</div>
			</div>
		</div>
		<Footer/>
		</>
	)
}

export default ArchivePage;

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