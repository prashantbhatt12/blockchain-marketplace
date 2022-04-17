import React from "react";
const DataGrid = (props) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Product Id</th>
          <th scope="col">Name</th>
          <th scope="col">Price</th>
          <th scope="col">Owner</th>
          <th scope="col" />
        </tr>
      </thead>
      <tbody id="productList">
        {props.data.map((product, key) => {
          return (
            <tr key={key}>
              <th scope="row">{product.id.toString()}</th>
              <td>{product.name}</td>
              <td>
                {window.web3.utils.fromWei(product.price.toString(), "Ether")}{" "}
                Eth
              </td>
              <td>{product.owner}</td>
              <td>
                {!props.isEnrolled && product.owner !== props.account ? (
                  <button
                    name={product.id}
                    value={product.price}
                    onClick={(event) => {
                      props.onCoursePurchase(
                        event.target.name,
                        event.target.value
                      );
                    }}
                  >
                    Buy
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
