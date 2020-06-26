import React from "react";
import { Footer } from "./Footer";
import { Alerts } from "./Alerts";

export const Layout = ({ children }) => (
  <div>
    {children}
    <Footer />
    <Alerts />
  </div>
);
