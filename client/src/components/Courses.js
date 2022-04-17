import React from "react";
import DataGrid from "./DataGrid";
const Courses = ({
  enrolledCourses,
  isEnrolled,
  totalDownloads,
  onRewardsAchieved,
}) => {
  return (
    <div id="content">
      <p>&nbsp;</p>
      <div className="d-flex justify-content-between">
        <div className="p-2">
          <h2>Enrolled Courses:</h2>
        </div>
        <div className="p-2">
          <button
            type="button"
            className={`btn ${
              totalDownloads >= 5 ? "btn-success" : " btn-secondary disabled"
            }`}
            onClick={onRewardsAchieved}
          >
            Get Rewards
          </button>
        </div>
      </div>
      <DataGrid data={enrolledCourses} isEnrolled={isEnrolled}></DataGrid>
    </div>
  );
};
export default Courses;
