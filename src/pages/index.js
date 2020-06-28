import { graphql, Link } from "gatsby";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGuitar,
  faUserAstronaut,
  faCity,
  faMapMarkedAlt,
  faAward,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { normalizeData, getLocalData, processCsvFromAws } from "../util/data";
import { Layout } from "../components/Layout";
import { Share } from "../components/Share";
import { theme } from "../util/theme";
import { getList } from "../util/aws";
import "./index.css";

const groupData = (data) => {
  const cities = _.groupBy(data, "city");
  const states = _.groupBy(data, "state");
  const artist = _.groupBy(data, "artist");
  const artistSorted = Object.keys(artist)
    .map(function (k) {
      return { key: k, value: artist[k] };
    })
    .sort(function (a, b) {
      return b.value.length - a.value.length;
    });

  return {
    cities,
    states,
    artist: artistSorted,
  };
};

const getMetrics = ({ artist, cities, states }, data) => [
  {
    title: "Shows",
    value: data.length,
    icon: faGuitar,
    iconColor: "#FFC107",
  },
  {
    title: "Artist",
    value: Object.keys(artist).length,
    icon: faUserAstronaut,
    iconColor: "#FF5722",
  },
  {
    title: "Cities",
    value: Object.keys(cities).length,
    icon: faCity,
    iconColor: "#4CAF50",
  },
  {
    title: "States",
    value: Object.keys(states).length,
    icon: faMapMarkedAlt,
    iconColor: "#E91E63",
  },
];

const initLocal = ({ setData, setLocal, rawData }) => {
  getLocalData()
    .then((d) => {
      if (d && d.length) {
        setData(normalizeData(d));
        setLocal(true);
      } else {
        setData(
          normalizeData(rawData.allAttendedCsv.edges.map(({ node }) => node))
        );
      }
    })
    .catch((e) => {
      console.error(e);
      setData(
        normalizeData(rawData.allAttendedCsv.edges.map(({ node }) => node))
      );
    });
};

const IndexPage = ({ data: rawData }) => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("You");
  const [local, setLocal] = useState(false);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (search.has("list")) {
      const id = search.get("list");

      // @todo add info to localStorage to help with reloads

      // Load the list from aws
      getList(id)
        .then(({ csv, info }) => {
          window.localStorage.setItem("list", id);
          processCsvFromAws(csv).then((shows) => {
            setData(normalizeData(shows));
            console.log("info", info);
            setName(info.name);
            setLocal(true);
          });
        })
        .catch((e) => {
          console.error(e);
          window.setAlert({
            status: "error",
            message: "We couldn't load shared list. Sorry dude!",
          });
          window.localStorage.clear("list");
          initLocal({ setLocal, setData, rawData });
        });
    } else {
      window.localStorage.clear("list");
      initLocal({ setLocal, setData, rawData });
    }
  }, [rawData]);

  if (!data.length) {
    return (
      <Layout>
        <div className={`${theme("bg-gray-100", "bg-gray-800")} min-h-screen`}>
          <div
            className={"flex justify-center items-center"}
            style={{ height: "100%", width: "100%" }}
          >
            <span className={"p-3 bg-white text-blue-900"}>Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  const groupedData = groupData(data);
  const { artist } = groupedData;

  return (
    <Layout>
      <div className={`${theme("bg-gray-100", "bg-gray-800")} min-h-screen`}>
        <div className="container mx-auto max-w-screen-md">
          <h2
            className={`${theme(
              "text-blue-900",
              "text-blue-100"
            )} text-5xl pt-6 ml-2`}
          >
            {local ? `${name} love music` : "Drew love️s music"}.
          </h2>
          <h2
            className={`${theme(
              "text-blue-400",
              "text-blue-200"
            )} text-3xl pb-3 text-opacity-50 ml-2`}
          >
            {local && (
              <>
                I mean {name} <em>really</em> love music.
              </>
            )}
            {!local && (
              <>
                I mean he <em>really</em> loves music.
              </>
            )}
          </h2>
          <div className={"flex flex-wrap"}>
            {getMetrics(groupedData, data).map(
              ({ title, value, icon, iconColor }) => (
                <div
                  key={`${title}-${value}`}
                  className={`${theme(
                    "bg-white",
                    "bg-gray-900"
                  )} mx-1 my-3 max-w-sm flex p-6 rounded-lg shadow-xl flex-grow`}
                >
                  <FontAwesomeIcon icon={icon} size={"3x"} color={iconColor} />
                  <div className="flex flex-col ml-6 pt-1">
                    <h4
                      className={`${theme(
                        "text-gray-900",
                        "text-gray-100"
                      )} text-2xl leading-tight mr-2`}
                    >
                      {value}
                    </h4>
                    <p
                      className={`${theme(
                        "text-gray-600",
                        "text-gray-500"
                      )} text-base leading-normal`}
                    >
                      {title}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
          {/*<Chart data={graphData} series={series} axes={axes} tooltip />*/}
          <div className="md:grid md:grid-flow-col block">
            <div
              className={`${theme(
                "bg-white",
                "bg-gray-900"
              )} mx-1 my-3 md:max-w-xl md:flex sm:flex p-6 rounded-lg shadow-xl`}
            >
              <h4 className="max-w-sm md:w-56 text-center mb-4 mx-auto">
                <span
                  className={`${theme(
                    "text-gray-700",
                    "text-gray-300"
                  )} text-5xl leading-tight`}
                >
                  Top 5
                </span>
                <br />
                <span className="text-sm text-gray-500">
                  by shows attendance
                </span>
              </h4>
              <ol className="md:pl-10 w-full">
                {(() => {
                  let temp = artist;
                  temp = temp.splice(0, 5);

                  return temp.map((data, index) => (
                    <li
                      key={data.key}
                      className={`${theme(
                        "text-black",
                        "text-gray-100"
                      )} flex w-full ${
                        index === 0 ? "sm:text-md md:text-xl" : ""
                      }`}
                    >
                      <div className="text-grey-500">{data.key}</div>{" "}
                      <div className="ml-auto text-grey-800">
                        {data.value.length} times
                      </div>
                    </li>
                  ));
                })()}
              </ol>
            </div>
            <div
              className={`${theme("bg-white", "bg-gray-900")} ${theme(
                "text-black",
                "text-gray-100"
              )} mx-1 my-3 md:max-w-md p-6 rounded-lg shadow-xl`}
            >
              <h3 className="text-lg mb-3">
                Have you been to a show with Drew?
              </h3>
              <div className={"flex flex-col text-center"}>
                <Link
                  to={"/archive"}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-2"
                >
                  Search Archive
                </Link>
                <Link
                  to={"/upload"}
                  className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Upload Your List
                </Link>
              </div>
            </div>
          </div>
          <div className="md:flex block">
            <div
              className={`${theme("text-black", "text-gray-100")} ${theme(
                "bg-white",
                "bg-gray-900"
              )} mx-1 my-3 md:max-w-sm flex p-6 rounded-lg shadow-xl flex-grow sm:w-full`}
            >
              <FontAwesomeIcon icon={faAward} size={"3x"} color={"#4a5568"} />
              <div className="flex flex-col ml-6 pt-1">
                <h3>
                  The first show Drew ever saw: <br />
                  <small>
                    {(() => {
                      const { artist, date, venue, location } = data[0];

                      return `${artist} on ${date.format(
                        "dddd MMMM Do YYYY"
                      )} at ${venue} in ${location}`;
                    })()}
                  </small>
                </h3>
              </div>
            </div>
            <div
              className={`${theme("text-black", "text-gray-100")} ${theme(
                "bg-white",
                "bg-gray-900"
              )} mx-1 my-3 md:max-w-sm flex p-6 rounded-lg shadow-xl flex-grow`}
            >
              <FontAwesomeIcon
                icon={faCalendarAlt}
                size={"3x"}
                color={"#4a5568"}
              />
              <div className="flex flex-col ml-6 pt-1">
                <h3>
                  Most recent show Drew has seen: <br />
                  <small>
                    {(() => {
                      const { artist, date, venue, location } = data.slice(
                        -1
                      )[0];

                      return `${artist} on ${date.format(
                        "dddd MMMM Do YYYY"
                      )} at ${venue} in ${location}`;
                    })()}
                  </small>
                </h3>
              </div>
            </div>
          </div>
          <Share />
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;

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
`;
