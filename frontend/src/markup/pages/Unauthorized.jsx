/* eslint-disable react/no-unescaped-entities */
// Unauthorized.js
import { Link } from "react-router-dom";
import "./unauthorized.css";

const Unauthorized = () => {
  return (
    <div className="mcontainer">
      <div className="mcontent">
        <h1 className="mtitle">
          Oops! You're not authorized to access this page.
        </h1>
        <p className="mdescription">
          It looks like you don't have the necessary permissions to view this
          content. Please check with your administrator or try again later.
        </p>
        <Link to="/" className="mbutton">
          Take me home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
