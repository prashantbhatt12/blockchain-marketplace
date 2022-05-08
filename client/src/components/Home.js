import React from "react";
import DataGrid from "./DataGrid";
const Home = (props) => {
  return (
    <div id="content">
      <p>&nbsp;</p>
      <div className="d-flex justify-content-between">
        <div className="p-2">
          <h2>Buy Courses:</h2>
        </div>
        <div className="p-2">
          <button
            type="button"
            className={`btn ${
              !props.airDropFlag ? "btn-success" : " btn-secondary disabled"
            }`}
            onClick={props.onAirDropClicked}
          >
            Air-Drop
          </button>
        </div>
      </div>
      <DataGrid
        data={props.availableCourses}
        onEnrollingCourse={props.onEnrollingCourse}
        isEnrolled={props.isEnrolled}
      ></DataGrid>
    </div>
  );
};
export default Home;
