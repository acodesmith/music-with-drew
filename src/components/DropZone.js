import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { theme } from "../util/theme";

const DropZone = ({ onDropCallback }) => {
  const onDrop = useCallback(onDropCallback, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="block">
        {isDragActive && (
          <div
            className={`${theme(
              "bg-white",
              "bg-blue-900"
            )} mx-1 my-3 border-dashed border-4 border-gray-600 md:flex sm:flex px-3 py-10 rounded-lg shadow-xl cursor-pointer`}
          >
            <h4 className="text-center mb-4 mx-auto">
              <span
                className={`${theme(
                  "text-gray-700",
                  "text-gray-300"
                )} text-5xl leading-tight`}
              >
                Drop it like it's hot...
              </span>
              <br />
              <span className="text-sm text-gray-500">Make em' drop it</span>
              <br />
              <span className={"text-lg text-gray-500"}>&hearts;</span>
            </h4>
          </div>
        )}
        {!isDragActive && (
          <div
            className={`${theme(
              "bg-white",
              "bg-gray-900"
            )} mx-1 my-3 border-dashed border-4 border-gray-600 md:flex sm:flex px-3 py-10 rounded-lg shadow-xl cursor-pointer`}
          >
            <h4 className="text-center mb-4 mx-auto">
              <span
                className={`${theme(
                  "text-gray-700",
                  "text-gray-300"
                )} text-5xl leading-tight`}
              >
                Upload Your List
              </span>
              <br />
              <span className="text-sm text-gray-500">.csv file only.</span>
              <br />
              <span className={"text-lg text-gray-500"}>&#91;&uarr;&#93;</span>
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};

export { DropZone };
