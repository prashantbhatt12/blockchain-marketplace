import React, { useRef } from "react";
const AddCourse = (props) => {
  const courseName = useRef();
  const coursePrice = useRef();
  const courseDesc = useRef();
  const onCourseAddHandler = (event) => {
    event.preventDefault();
    //console.log(courseName.current.value, coursePrice.current.value, courseDesc.current.value);
    // value: Due to form field
    const name = courseName.current.value;
    const price = window.web3.utils.toWei(
      coursePrice.current.value.toString(),
      "Ether"
    );
    const desc = courseDesc.current.value;
    props.onCourseAdded(name, price, desc);
  };
  return (
    <>
      <div className="d-flex flex-column">
        <div className="p-2 bd-highlight">
          <h1 className="text-center">Add a course</h1>
          <form className="w-50 mx-auto" onSubmit={onCourseAddHandler}>
            <div className="mb-2 justify-content-center">
              <input
                id="courseName"
                type="text"
                ref={courseName}
                className="form-control"
                placeholder="Course Name"
                required
              />
            </div>
            <div className="form-group mr-sm-2 mb-2">
              <input
                id="coursePrice"
                type="number"
                ref={coursePrice}
                className="form-control"
                placeholder="Course Price"
                step="any"
                required
              />
            </div>
            <div className="form-group mr-sm-2 mb-2">
              <textarea
                id="courseDesc"
                type="text"
                ref={courseDesc}
                className="form-control"
                placeholder="Course Description"
                style={{ height: 100 }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Course
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default AddCourse;
