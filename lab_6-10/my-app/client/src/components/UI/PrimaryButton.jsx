import React from "react";

function PrimaryButton({ children, ...rest }) {
  return (
    <button className="primary-btn" {...rest}>
      {children}
    </button>
  );
}

export default PrimaryButton;
