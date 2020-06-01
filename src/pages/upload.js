import React, { useState, useCallback } from "react";
import { navigate } from "gatsby";
import Link from "gatsby-link";
import { DropZone } from "../components/DropZone";
import { theme } from "../util/theme";
import { processCsv } from "../util/data";

const Upload = () => {
  const [processing, setProcessing] = useState(false);

  const onDropCallback = useCallback(files => {
    const [cvs] = files;

    if (!cvs) {
      alert("Error uploading your csv! Try again please.");
      return;
    }

    if (cvs.name.split(".").pop() !== "csv") {
      alert("Only .csv files accepted! Please upload the correct format.");
      return;
    }

    setProcessing(true);

    processCsv(cvs).then(() => {
			navigate('/')
    })
      .catch(() => {
        alert('Something went wrong. Not sure dude. Refresh the page and try again.');
				setProcessing(false);
      });
  }, []);

  return (
    <div className={`${theme("bg-gray-100", "bg-gray-800")} min-h-screen`}>
      <div className="container mx-auto max-w-screen-md pt-3">
        {!processing && <DropZone onDropCallback={onDropCallback} />}
        {processing && (
          <div
            className={`${theme(
              "bg-white",
              "bg-green-900"
            )} mx-1 my-3 border-solid border-4 border-green-600 md:flex sm:flex px-3 py-10 rounded-lg shadow-xl cursor-pointer`}
          >
            <h4 className="text-center mb-4 mx-auto">
              <span
                className={`${theme(
                  "text-gray-700",
                  "text-gray-300"
                )} text-5xl leading-tight`}
              >
                Processing your show list.
              </span>
              <br />
              <span className="text-sm text-gray-500">
                Digitally dancing in the dark
              </span>
              <br />
              <span className={"text-lg text-gray-500"}> &infin;</span>
            </h4>
          </div>
        )}
        <div className={"bg-blue-900 p-2 text-white rounded-sm"}>
          <h3 className={"px-2 py-1 text-lg"}>Example .csv</h3>
          <div className="border-solid border-1 border-red-100">
            <table className={"table-auto w-full"}>
              <thead>
                <tr>
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
                    City/State
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={"py-1 px-2"}>"Mr. Amazing's Cool Band"</td>
                  <td className={"py-1 px-2"}>2/28/1987</td>
                  <td className={"py-1 px-2"}>"Dr Fred's Taco Shack"</td>
                  <td className={"py-1 px-2"}>"Raleigh, NC"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={"bg-blue-100 mt-3 p-2 text-gray-900 rounded-sm"}>
          <h4 className={"px-2 py-1 text-md font-bold"}>
            Heads up! Formatting!
          </h4>
          <dl className={"block md:grid grid-cols-2 gap-4"}>
            {[
              {
                dt: "Band",
                dd:
                  "Accepted name of the musical act. Avoid abbreviations or nick names. If the band name contains a common, you must wrap the band name in double quotes."
              },
              {
                dt: "Date",
                dd:
                  "Month/Day/Year - for example January 30th 2019 would be 1/30/2019."
              },
              {
                dt: "Venue",
                dd:
                  "Name of the location which hosted the musical act. Avoid abbreviations or nick names. If the venue name contains a common, you must wrap the venue name in double quotes."
              },
              {
                dt: "City",
                dd:
                  "Because city and state are separated by a comma the column must be contained in double quotes."
              }
            ].map(({ dt, dd }) => (
              <div className={"p-2"} key={dt}>
                <dt className={"text-lg"}>{dt}</dt>
                <dd className={"text-gray-700"}>{dd}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex mt-3 pb-5">
          <Link
            to="/"
            className="bg-blue-200 inline hover:bg-blue-300 text-grey-900 font-bold py-2 px-4 rounded-full"
          >
            &#x25C0; Nah, I'm good.
          </Link>
          <Link
            to="/"
            className="ml-2 ml-auto bg-blue-400 hover:bg-blue-300 text-grey-900 font-bold py-2 px-4 rounded-full"
          >
            &#91;&darr;&#93; Download Template
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Upload;
