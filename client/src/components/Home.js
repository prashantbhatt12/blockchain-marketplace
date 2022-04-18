import React from "react";
import DataGrid from "./DataGrid";
const Home = (props) => {
  return (
    <div id="content">
      <p>&nbsp;</p>
      <h2>Buy Courses:</h2>
      <DataGrid
        data={props.availableCourses}
        onEnrollingCourse={props.onEnrollingCourse}
        isEnrolled={props.isEnrolled}
      ></DataGrid>
    </div>
  );
};
export default Home;
