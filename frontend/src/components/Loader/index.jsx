import React from "react";
import "./Loader.scss";

const Loader = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", paddingTop: "2rem" }}
    >
      <div className="spinner">
        <span className="spinner-inner-1"/>
        <span className="spinner-inner-2"/>
        <span className="spinner-inner-3"/>
      </div>
    </div>
  );
};

export default Loader;