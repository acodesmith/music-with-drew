import React, { useEffect, useState } from "react";

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

export const Alerts = () => {
  const [customAlert, setAlert] = useState();

  const updateAlerts = () => {
    setAlert(window.customAlert);

    setTimeout(() => {
      setAlert(undefined);
    }, 3000);
  };

  useEffect(() => {
    window.customAlertReady = true;
    window.addEventListener("updateAlerts", updateAlerts);

    return () => {
      window.removeEventListener("updateAlerts", updateAlerts);
    };
  }, []);

  return (
    <div className={"absolute"} style={{ right: "1rem", top: "1rem" }}>
      {customAlert && (
        <div
          className={
            "bg-red-300 border-red-900 rounded border-3 border-solid text-red-900 p-2 shadow-lg text-sm"
          }
        >
          {customAlert}
        </div>
      )}
    </div>
  );
};
