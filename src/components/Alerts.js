import React, { useEffect, useState } from "react";
import { isServer } from "../util/server";

if(!isServer) {
	window.customAlert = undefined;
	window.setAlert = (alert) => {
		window.customAlert = alert;

		setTimeout(
			() => {
				window.dispatchEvent(new Event("updateAlerts"));
			},
			window.customAlertReady ? 0 : 500
		);
	};
}

const statusClassNames = {
  error: "bg-red-300 border-red-900 text-red-900",
  info: "bg-blue-300 border-blue-900 text-blue-900",
  success: "bg-green-300 border-green-900 text-green-900",
};

export const Alerts = () => {
  const [customAlert, setAlert] = useState();

  const updateAlerts = () => {
    if(!isServer) {
			setAlert(window.customAlert);
		}

    setTimeout(() => {
      setAlert(undefined);
    }, 3000);
  };

  useEffect(() => {
		if(!isServer) {
			window.customAlertReady = true;
			window.addEventListener("updateAlerts", updateAlerts);
		}

    return () => {
			isServer || window.removeEventListener("updateAlerts", updateAlerts);
    };
  }, []);

  return (
    <div className={"fixed"} style={{ right: "1rem", top: "1rem" }}>
      {customAlert && (
        <div
          className={`rounded border-3 border-solid p-2 shadow-lg text-sm ${
            statusClassNames[customAlert.status]
          }`}
        >
          {customAlert.message}
        </div>
      )}
    </div>
  );
};
