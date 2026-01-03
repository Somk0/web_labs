import React from "react";

function Select({ children, ...rest }) {
  return (
    <select className="ui-select" {...rest}>
      {children}
    </select>
  );
}

export default Select;
