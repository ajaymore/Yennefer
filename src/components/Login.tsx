import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import { useLocation, useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  PrimaryButton,
  Link,
  Icon,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import RouterLink from './RouterLink';
import { useWindowSize } from '../hooks/useWindowSize';

function Login() {
  const history = useHistory();
  const { state }: any = useLocation();
  const { width, height } = useWindowSize();
  const { from } = state || { from: '/' };

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        history.push(from);
      }
    });
  }, [from, history]);

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
            // boxShadow:
            //   '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Icon
              iconName="Signin"
              style={{
                fontSize: 32,
                border: '2px solid',
                padding: 16,
                borderRadius: 50,
                marginBottom: 16
              }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              className="google-auth-btn"
              onClick={e => {
                e.preventDefault();
                firebase
                  .auth()
                  .signInWithPopup(new firebase.auth.GoogleAuthProvider());
              }}
            >
              &nbsp;
            </button>
          </div>
          <br />
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={() =>
              Yup.object({
                email: Yup.string()
                  .label('Email')
                  .email()
                  .required(),
                password: Yup.string()
                  .label('Password')
                  .required()
              })
            }
            onSubmit={async (values, actions) => {
              try {
                await firebase
                  .auth()
                  .signInWithEmailAndPassword(values.email, values.password);
              } catch (error) {
                actions.setSubmitting(false);
                if (error.code === 'auth/user-not-found') {
                  actions.setStatus({
                    message: 'We could not find this user!',
                    type: 'Error'
                  });
                } else if (error.code === 'auth/wrong-password') {
                  actions.setStatus({
                    message: 'Seems like you entered a wrong password!',
                    type: 'Error'
                  });
                } else {
                  actions.setStatus({
                    message: 'Sorry We could not authenticate you!',
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
                      : ''
                  }
                  iconProps={{ iconName: 'PasswordField' }}
                />
                <br />
                <div style={{ textAlign: 'center' }}>
                  <PrimaryButton
                    text="Login"
                    type="submit"
                    allowDisabledFocus
                    disabled={formikProps.isSubmitting}
                    style={{ width: 200 }}
                  />
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <RouterLink to="/sign-up">
                    <Link>Sign Up</Link>
                  </RouterLink>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <RouterLink to="/forgot-password">
                    <Link>Forgot Password</Link>
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

export default Login;
