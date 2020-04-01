import React, { useState, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteProps,
  useLocation,
  Redirect
} from 'react-router-dom';
import { Fabric, Spinner, SpinnerSize } from '@fluentui/react';
import { NotFound404 } from './components/NotFound404';
import firebase from 'firebase/app';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgetPassword from './components/ForgetPassword';
import Admin from './components/Admin';
import SideNavigation from './components/SideNavigation';

const AcademicKnowledge = React.lazy(() =>
  import('./components/AcademicKnowledge')
);
const FakeData = React.lazy(() => import('./components/FakeData'));

const ProtectedRoute: React.FC<RouteProps & { user: firebase.User | null }> = ({
  children,
  user,
  ...rest
}) => {
  const { pathname } = useLocation();

  if (!user) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: pathname }
        }}
      />
    );
  }

  return (
    <SideNavigation>
      <Route {...rest}>{children}</Route>
    </SideNavigation>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | firebase.User>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
      setLoading(false);
      setUser(user);
      if (user) {
        let dbEntry = null;
        if (user.email) {
          dbEntry = await firebase
            .firestore()
            .collection('users')
            .where('email', '==', user.email)
            .get();
        } else if (user.phoneNumber) {
          dbEntry = await firebase
            .firestore()
            .collection('users')
            .where('phoneNumber', '==', user.phoneNumber)
            .get();
        }
        if (dbEntry && !dbEntry.docs.length) {
          firebase
            .firestore()
            .collection('users')
            .add({
              uid: user.uid,
              email: user.email ? user.email.toLowerCase() : '',
              emailVerified: user.emailVerified,
              displayName: user.displayName,
              phoneNumber: user.phoneNumber
            });
        } else if (dbEntry) {
          const doc = dbEntry.docs[0];
          firebase
            .firestore()
            .doc(doc.ref.path)
            .update({
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              displayName: user.displayName,
              phoneNumber: user.phoneNumber
            });
        }
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <Fabric>
        <div style={{ marginTop: 150 }}>
          <Spinner size={SpinnerSize.large} label="Loading" />
        </div>
      </Fabric>
    );
  }

  return (
    <Router>
      <Fabric>
        <Switch>
          <ProtectedRoute exact path="/" user={user}>
            <div>
              <h1 style={{ textAlign: 'center' }}>Welcome To the login page</h1>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => {
                  firebase.auth().signOut();
                }}
              >
                Sign out
              </button>
            </div>
          </ProtectedRoute>
          <ProtectedRoute path="/admin" user={user}>
            <Admin />
          </ProtectedRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/sign-up">
            <SignUp />
          </Route>
          <Route path="/forgot-password">
            <ForgetPassword />
          </Route>
          <Route path="/project-academic-knowledge">
            <Suspense fallback={<Spinner />}>
              <AcademicKnowledge />
            </Suspense>
          </Route>
          <Route path="/fake-data">
            <Suspense fallback={<Spinner />}>
              <FakeData />
            </Suspense>
          </Route>
          <Route path="*">
            <NotFound404 />
          </Route>
        </Switch>
      </Fabric>
    </Router>
  );
}

export default App;
