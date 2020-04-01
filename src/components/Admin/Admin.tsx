import React from 'react';
import { useRouteMatch, Route, Redirect } from 'react-router-dom';
import Users from './Users';

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
        <div>Groups</div>
      </Route>
    </div>
  );
}

export default Admin;
