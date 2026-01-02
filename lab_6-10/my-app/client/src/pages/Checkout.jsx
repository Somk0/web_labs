import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PrimaryButton from "../components/UI/PrimaryButton";
import { useNavigate } from "react-router-dom";

const schema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  phone: Yup.string().required("Required"),
  address: Yup.string().required("Required")
});

function Checkout() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: ""
    },
    validationSchema: schema,
    onSubmit: (values) => {
      alert(
        "Order sent! (для лаб достатньо, можна показати викладачу в консолі)"
      );
      navigate("/");
    }
  });

  const showError =
    Object.keys(formik.errors).length > 0 &&
    formik.submitCount > 0;

  return (
    <div>
      <h2 className="page-title">Checkout</h2>

      <form
        className="checkout-form"
        onSubmit={formik.handleSubmit}
      >
        <div className="form-row">
          <input
            name="firstName"
            placeholder="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
          />
        </div>
        <div className="form-row">
          <input
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
          />
        </div>
        <div className="form-row">
          <input
            name="address"
            placeholder="Address"
            value={formik.values.address}
            onChange={formik.handleChange}
          />
        </div>

        <div className="form-row">
          <PrimaryButton
            type="button"
            onClick={() => navigate(-1)}
          >
            Go Back
          </PrimaryButton>
          <PrimaryButton type="submit">
            Continue
          </PrimaryButton>
        </div>

        {showError && (
          <div className="alert-error">
            <b>Oh snap!</b> Change a few things up and try
            submitting again.
          </div>
        )}
      </form>
    </div>
  );
}

export default Checkout;
