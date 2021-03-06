import React, { useState, useCallback, useEffect } from "react";
import { navigate } from "gatsby";
import Link from "gatsby-link";
import { DropZone } from "../components/DropZone";
import { Layout } from "../components/Layout";
import { theme } from "../util/theme";
import {
  processCsvFromUpload,
  getLocalData,
  clearLocalData,
  makeFileName,
} from "../util/data";
import { downloadFile } from "../util/download";
import { getSignedUploadUrl, uploadCsv, uploadDetails } from "../util/aws";
import { isServer } from "../util/server";
import "./index.css";

const downloadCsv = () => {
  downloadFile(
    "music-with-you-template",
    "band,date,venue,city,\n" +
      'Mr. Fake Band,2/28/1987,Reynolds Coliseum,"Raleigh, NC",'
  );
};

const Upload = () => {
  const [name, setName] = useState();
  const [processing, setProcessing] = useState(false);
  const [local, setLocal] = useState(false);

  useEffect(() => {
    getLocalData().then((d) => {
      if (d && d.length) {
        setLocal(true);
      }
    });
  }, []);

  const onDropCallback = useCallback(
    (files) => {
      const [cvs] = files;

      if (!isServer && !cvs) {
        window.setAlert({
          status: "error",
          message: "Error uploading your csv! Try again please.",
        });
        return;
      }

      if (cvs.name.split(".").pop() !== "csv" && !isServer) {
        window.setAlert({
          status: "error",
          message:
            "Only .csv files accepted! Please upload the correct format.",
        });
        return;
      }

      setProcessing(true);

      processCsvFromUpload(cvs)
        .then((shows) => {
          console.log("shows added to local storage: ", shows);
          const fileName = makeFileName();
          getSignedUploadUrl(fileName).then(async (urls) => {
            if (urls) {
              await uploadCsv(urls.csvUrl, files.shift());
              await uploadDetails(urls.fileUrl, { name });
              navigate(`/?list=${fileName}`);
            } else {
              navigate("/");
            }
          });
        })
        .catch(() => {
          if(!isServer) {
						window.setAlert({
							status: "error",
							message:
								"Something went wrong. Not sure dude. Refresh the page and try again.",
						});
          }
          setProcessing(false);
        });
    },
    [name]
  );

  const onClearData = useCallback(() => {
    clearLocalData().then(() => {
      setLocal(false);
      if(!isServer) {
				window.setAlert({
					status: "info",
					message: "Data cleared! Original list now active.",
				});
      }
    });
  }, []);

  const onDownloadTemplate = useCallback(() => {
    downloadCsv();
  }, []);

  return (
    <Layout>
      <div className={`${theme("bg-gray-100", "bg-gray-800")} min-h-screen`}>
        <div className="container mx-auto max-w-screen-md pt-3">
          {!name && (
            <form
              className={`${theme(
                "bg-white",
                "bg-blue-900"
              )} mx-1 my-3 border-solid border-4 border-gray-600 flex-col flex md:flex sm:flex px-3 py-10 rounded-lg shadow-xl`}
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.target);
                const name = form.get("name");
                if (!name || name === "" && !isServer) {
                  window.setAlert({
                    status: "error",
                    message: "Name required!",
                  });
                } else {
                  setName(name);
                }
              }}
            >
              <label
                className={`${theme(
                  "text-blue-900",
                  "text-white"
                )} w-full text-3xl`}
              >
                <span className={"block"}>What is your name?</span>
                <small
                  className={`${theme(
                    "text-blue-800",
                    "text-white"
                  )} block text-sm mb-2`}
                >
                  (so we can name your list)
                </small>
                <input
                  type={"text"}
                  name={"name"}
                  className={"w-full text-blue-900 p-2 rounded"}
                />
              </label>
              <button
                type={"submit"}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2"
              >
                Continue
              </button>
            </form>
          )}
          {!processing && name && <DropZone onDropCallback={onDropCallback} />}
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
                    "Accepted name of the musical act. Avoid abbreviations or nick names. If the band name contains a common, you must wrap the band name in double quotes.",
                },
                {
                  dt: "Date",
                  dd:
                    "Month/Day/Year - for example January 30th 2019 would be 1/30/2019.",
                },
                {
                  dt: "Venue",
                  dd:
                    "Name of the location which hosted the musical act. Avoid abbreviations or nick names. If the venue name contains a common, you must wrap the venue name in double quotes.",
                },
                {
                  dt: "City",
                  dd:
                    "Because city and state are separated by a comma the column must be contained in double quotes.",
                },
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
            {local && (
              <button
                className="ml-2 ml-auto bg-red-400 hover:bg-red-300 text-grey-900 font-bold py-2 px-4 rounded-full"
                onClick={onClearData}
              >
                &#91;&times;&#93; Clear Your Data
              </button>
            )}
            <button
              onClick={onDownloadTemplate}
              className="ml-2 ml-auto bg-blue-400 hover:bg-blue-300 text-grey-900 font-bold py-2 px-4 rounded-full"
            >
              &#91;&darr;&#93; Download Template
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
