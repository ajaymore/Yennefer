import React from 'react';
import { useRouteMatch, Route, Redirect } from 'react-router-dom';
import Users from './Users';
import Groups from './Groups';

function Admin() {
  const { path } = useRouteMatch();
  return (
    <div>
      <Route exact path={path}>
        <Redirect to={`${path}/users`} />
      </Route>
      <Route path={`${path}/users`}>
        <Users />
      </Route>
      <Route path={`${path}/groups`}>
        <Groups />
      </Route>
    </div>
  );
}

export default Admin;
