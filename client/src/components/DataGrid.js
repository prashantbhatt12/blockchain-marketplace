import React from "react";
const DataGrid = (props) => {
  const onEnrollClickHandler = (event) => {
    props.onEnrollingCourse(event.target.name, event.target.value);
  };
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Course Id</th>
          <th scope="col">Name</th>
          <th scope="col">Course Description</th>
          <th scope="col">Price</th>
          <th scope="col">Owner</th>
          <th scope="col" />
        </tr>
      </thead>
      <tbody id="productList">
        {props.data.map((course, key) => {
          return (
            <tr key={key}>
              <th scope="row">{course.id.toString()}</th>
              <td>{course.name}</td>
              <td>{course.desc}</td>
              <td>
                {window.web3.utils.fromWei(course.price.toString(), "Ether")}{" "}
                PRC
              </td>
              <td>{course.owner}</td>
              <td>
                {!props.isEnrolled && course.owner !== props.account ? (
                  <button
                    name={course.id}
                    value={course.price}
                    onClick={onEnrollClickHandler}
                    className="btn btn-success"
                  >
                    Enroll
                  </button>
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataGrid;
