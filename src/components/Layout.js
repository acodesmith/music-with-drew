import React from "react";
import { Head } from "./Head";
import { Footer } from "./Footer";
import { Alerts } from "./Alerts";

export const Layout = ({ children }) => (
  <div>
    <Head />
    {children}
    <Footer />
    <Alerts />
  </div>
);
