import React from "react";
import Link from "gatsby-link";
import { DropZone } from "../components/DropZone";
import { theme } from "../util/theme";

const Upload = () => (
  <div className={`${theme("bg-gray-100", "bg-gray-800")} min-h-screen`}>
    <div className="container mx-auto max-w-screen-md pt-3">
      <DropZone />
      <div className={"bg-blue-900 p-2 text-white rounded"}>
        <h3 className={"px-2 py-1 text-lg"}>.csv format:</h3>
        <div className="border-solid border-1 border-red-100">
          <table className={"table-auto w-full"}>
            <thead>
              <th
                className={`${theme(
                  "bg-blue-100",
                  "bg-blue-900"
                )} border-solid border-2 border-gray-300 border-t-0 border-l-0 border-r-0 sticky top-0 px-2 py-1 text-left`}
              >
                Band
              </th>
              <th
                className={`${theme(
                  "bg-blue-100",
                  "bg-blue-900"
                )} border-solid border-2 border-gray-300 border-t-0 border-l-0 border-r-0 sticky top-0 px-2 py-1 text-left`}
              >
                Date
              </th>
              <th
                className={`${theme(
                  "bg-blue-100",
                  "bg-blue-900"
                )} border-solid border-2 border-gray-300 border-t-0 border-l-0 border-r-0 sticky top-0 px-2 py-1 text-left`}
              >
                Venue
              </th>
              <th
                className={`${theme(
                  "bg-blue-100",
                  "bg-blue-900"
                )} border-solid border-2 border-gray-300 border-t-0 border-l-0 border-r-0 sticky top-0 px-2 py-1 text-left`}
              >
                City
              </th>
            </thead>
            <tbody>
              <td className={"py-1 px-2"}>Huey Lewis & The News</td>
              <td className={"py-1 px-2"}>2/28/1987</td>
              <td className={"py-1 px-2"}>Reynolds Coliseum</td>
              <td className={"py-1 px-2"}>"Raleigh, NC"</td>
            </tbody>
          </table>
        </div>
      </div>
      <Link
        to="/"
        className="mt-3 inline-block bg-blue-200 hover:bg-blue-300 text-grey-900 font-bold py-2 px-4 rounded-full"
      >
        &#x25C0; Nah, I'm good.
      </Link>
    </div>
  </div>
);

export default Upload;
