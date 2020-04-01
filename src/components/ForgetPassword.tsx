import React from 'react';
import firebase from 'firebase/app';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useWindowSize } from '../hooks/useWindowSize';
import {
  TextField,
  PrimaryButton,
  Link,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import RouterLink from './RouterLink';

function ForgetPassword() {
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
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <div
          className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-depth-8 login-box"
          style={{
            padding: 32,
            backgroundColor: '#fff'
          }}
        >
          <Formik
            initialValues={{ email: '' }}
            validationSchema={() =>
              Yup.object({
                email: Yup.string()
                  .label('Email')
                  .email()
                  .required()
              })
            }
            onSubmit={async (values, actions) => {
              try {
                await firebase.auth().sendPasswordResetEmail(values.email);
              } catch (error) {
                actions.setSubmitting(false);
                if (error.code === 'auth/invalid-email') {
                  actions.setStatus({
                    message: 'Invalid Email address',
                    type: 'Error'
                  });
                } else if (error.code === 'auth/user-not-found') {
                  actions.setStatus({
                    message: 'No User found',
                    type: 'Error'
                  });
                } else {
                  actions.setStatus({
                    message: 'Sorry We could not reset the password',
                    type: 'Error'
                  });
                }
              }
            }}
          >
            {formikProps => (
              <Form noValidate>
                {formikProps.status && formikProps.status.type === 'Error' && (
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
                    formikProps.touched.email ? formikProps.errors.email : ''
                  }
                  iconProps={{ iconName: 'PublicEmail' }}
                />
                <br />
                <div style={{ textAlign: 'center' }}>
                  <PrimaryButton
                    text="Reset Password"
                    type="submit"
                    allowDisabledFocus
                    disabled={formikProps.isSubmitting}
                    style={{ width: 200 }}
                  />
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
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

export default ForgetPassword;
