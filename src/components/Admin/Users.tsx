import React from 'react';
import { Panel, PrimaryButton, Link } from '@fluentui/react';
import {
  useHistory,
  useLocation,
  Route,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import NewUser from './NewUser';
import RouterLink from '../RouterLink';

function UserList() {
  const { pathname } = useLocation();
  // fetch all users from firebase and display
  const id = '123456';
  return (
    <div>
      <RouterLink to={`${pathname}/edit/${id}`}>
        <Link>Edit</Link>
      </RouterLink>
    </div>
  );
}

function UpdateUser() {
  const { id }: any = useParams();
  return <div>Update User with id {id}</div>;
}

function Users() {
  const history = useHistory();
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  return (
    <div style={{ padding: 16 }}>
      <PrimaryButton
        onClick={() => {
          history.push(`${pathname}/new`);
        }}
      >
        New User
      </PrimaryButton>
      <Route path={path}>
        <UserList />
      </Route>
      <Route path={`${path}/new`}>
        <Panel
          headerText="New User"
          isOpen={true}
          onDismiss={() => {
            history.push(path);
          }}
          // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
          closeButtonAriaLabel="Close"
        >
          <NewUser />
        </Panel>
      </Route>
      <Route path={`${path}/edit/:id`}>
        <Panel
          headerText="Update User"
          isOpen={true}
          onDismiss={() => {
            history.push(path);
          }}
          // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
          closeButtonAriaLabel="Close"
        >
          <UpdateUser />
        </Panel>
      </Route>
    </div>
  );
}

export default Users;
