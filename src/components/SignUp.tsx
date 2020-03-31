import React, { useEffect } from "react";
import firebase from "firebase/app";
import { useLocation, useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  PrimaryButton,
  Link,
  Icon,
  MessageBar,
  MessageBarType
} from "office-ui-fabric-react";
import RouterLink from "./RouterLink";
import { useWindowSize } from "../hooks/useWindowSize";

function SignUp() {
  const { width, height } = useWindowSize();

  return (
    <div
      style={{
        width,
        height
      }}
      className="ms-Grid login-container"
    >
      <div
        className="ms-Grid-row"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-depth-8 login-box"
          style={{
            padding: 32,
            backgroundColor: "#fff"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Icon
              iconName="Signin"
              style={{
                fontSize: 32,
                border: "2px solid",
                padding: 16,
                borderRadius: 50,
                marginBottom: 16
              }}
            />
          </div>

          <br />
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={() =>
              Yup.object({
                email: Yup.string()
                  .label("Email")
                  .email()
                  .required(),
                password: Yup.string()
                  .label("Password")
                  .required(),
                confirmPassword: Yup.string()
                  .label("Confirm Password")
                  .required()
                  .when("password", {
                    is: val => (val && val.length > 0 ? true : false),
                    then: Yup.string().oneOf(
                      [Yup.ref("password")],
                      "Both password need to be the same"
                    )
                  })
              })
            }
            onSubmit={async (values, actions) => {
              try {
                await firebase
                  .auth()
                  .createUserWithEmailAndPassword(
                    values.email,
                    values.password
                  );
              } catch (error) {
                actions.setSubmitting(false);
                if (error.code === "auth/email-already-in-use") {
                  actions.setStatus({
                    message: "This User already Exist",
                    type: "Error"
                  });
                } else if (error.code === "auth/invalid-email") {
                  actions.setStatus({
                    message: "Invalid email address",
                    type: "Error"
                  });
                } else if (error.code === "auth/wrong-password") {
                  actions.setStatus({
                    message: "Seems like you entered a wrong password!",
                    type: "Error"
                  });
                } else {
                  actions.setStatus({
                    message: "Sorry We could not authenticate you!",
                    type: "Error"
                  });
                }
              }
            }}
          >
            {formikProps => (
              <Form noValidate>
                {formikProps.status && formikProps.status.type === "Error" && (
                  <div>
                    <MessageBar
                      messageBarType={MessageBarType.error}
                      isMultiline={false}
                      dismissButtonAriaLabel="Close"
                      onDismiss={() => {}}
                    >
                      {formikProps.status.message}
                    </MessageBar>
                    <br />
                  </div>
                )}
                <TextField
                  label="Email"
                  required
                  name="email"
                  value={formikProps.values.email}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  errorMessage={
                    formikProps.touched.email ? formikProps.errors.email : ""
                  }
                  iconProps={{ iconName: "PublicEmail" }}
                />
                <TextField
                  type="password"
                  label="Password"
                  required
                  name="password"
                  value={formikProps.values.password}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  errorMessage={
                    formikProps.touched.password
                      ? formikProps.errors.password
                      : ""
                  }
                  iconProps={{ iconName: "PasswordField" }}
                />
                <TextField
                  type="password"
                  label="Confirm Password"
                  required
                  name="confirmPassword"
                  value={formikProps.values.confirmPassword}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  errorMessage={
                    formikProps.touched.confirmPassword
                      ? formikProps.errors.confirmPassword
                      : ""
                  }
                  iconProps={{ iconName: "PasswordField" }}
                />
                <br />
                <div style={{ textAlign: "center" }}>
                  <PrimaryButton
                    text="SignUp"
                    type="submit"
                    allowDisabledFocus
                    disabled={formikProps.isSubmitting}
                    style={{ width: 200 }}
                  />
                </div>
                <br />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <RouterLink to="/login">
                    <Link>Go Back to Login Page</Link>
                  </RouterLink>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
