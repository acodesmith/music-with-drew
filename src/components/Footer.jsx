import { Link } from "gatsby";
import React from "react";
// import { inversedTheme, flipTheme, theme } from "../util/theme";

export const Footer = () => (
  <footer className="bg-gray-600 w-full flex flex-row p-1">
    <div>
      <Link className="text-gray-200 text-sm" to="/">
        Music with Drew
      </Link>
      <span className="text-gray-500 px-1">|</span>
      <Link className="text-gray-200 text-sm" to="/archive">
        Archive
      </Link>
    </div>
    <div className="ml-auto text-gray-200 text-sm">
      &copy; {new Date().getFullYear()}
      <span className="text-gray-500 px-1">|</span>
      <span className="text-gray-200 text-sm">Drew Hackney</span>
      <span className="text-gray-500 px-1">&</span>
      <a
        className="text-gray-200 text-sm"
        href="https://acodesmith.com"
        target="_blank"
        rel="noreferrer"
      >
        Adam Smith
      </a>
      {/*<span className="px-1"></span>*/}
      {/*<a*/}
      {/*href={'#'}*/}
      {/*className={`${theme('text-gray-100', 'text-gray-900')} ${theme('bg-gray-900', 'bg-gray-100')} text-xs rounded-sm p-1`}*/}
      {/*onClick={(e) => {*/}
      {/*e.preventDefault();*/}
      {/*flipTheme();*/}
      {/*window.location.reload();*/}
      {/*}}*/}
      {/*>*/}
      {/*{inversedTheme} Mode*/}
      {/*</a>*/}
    </div>
  </footer>
);
