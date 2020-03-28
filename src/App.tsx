import React, { useState, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteProps,
  useLocation,
  Redirect
} from 'react-router-dom';
import { Fabric, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import { NotFound404 } from './components/NotFound404';
import firebase from 'firebase/app';
import Login from './components/Login';

const AcademicKnowledge = React.lazy(() =>
  import('./components/AcademicKnowledge')
);

const ProtectedRoute: React.FC<RouteProps & { user: any }> = ({
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

  return <Route {...rest}>{children}</Route>;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | firebase.User>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setLoading(false);
      if (user) {
        setUser(user);
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
            <div>I am home page</div>
          </ProtectedRoute>
          <ProtectedRoute exact path="/protected" user={user}>
            <div>I am protected page</div>
            <button
              onClick={() => {
                firebase.auth().signOut();
              }}
            >
              Sign out
            </button>
          </ProtectedRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/sign-up">
            <div>Sign up</div>
          </Route>
          <Route path="/forgot-password">
            <div>Forgot password</div>
          </Route>
          <Route path="/project-academic-knowledge">
            <Suspense fallback={Spinner}>
              <AcademicKnowledge />
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
