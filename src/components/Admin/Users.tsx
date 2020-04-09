import React, { useState, useEffect, useMemo } from "react";
import {
  Panel,
  PrimaryButton,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Announced,
  TextField,
} from "@fluentui/react";
import {
  useHistory,
  useLocation,
  Route,
  useRouteMatch,
} from "react-router-dom";
import NewUser from "./NewUser";
import EditUser from "./EditUser";
import { useWindowSize } from "../../hooks/useWindowSize";
import firebase from "firebase/app";
import { format } from "date-fns";

type Users = {
  id: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  groups: string;
}[];

const controlStyles = {
  root: {
    margin: "0 30px 20px 0",
    maxWidth: "200px",
  },
};

function Users() {
  const history = useHistory();
  const [users, setUsers] = useState<Users>([]);
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  const { height } = useWindowSize();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .orderBy("displayName", "asc")
      .onSnapshot((querySnapshot) => {
        let array: any = [];
        querySnapshot.forEach((doc) => {
          array = [...array, { id: doc.id, key: doc.id, ...doc.data() }];
        });
        setUsers(array);
      });
    return unsubscribe;
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "column1",
        name: "Name",
        fieldName: "displayName",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },

      {
        key: "column2",
        name: "Email",
        fieldName: "email",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },

      {
        key: "column3",
        name: "Phone",
        fieldName: "phoneNumber",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },

      {
        key: "column4",
        name: "Date Of Birth",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item?: any, index?: number) => {
          if (item.birthDate) {
            return format(item.birthDate.toDate(), "dd MMM yyyy");
          }
          return "";
        },
      },

      {
        key: "column5",
        name: "Gender",
        fieldName: "gender",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
      },

      {
        key: "column6",
        name: "Groups",
        fieldName: "groups",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item?: any, index?: number) => {
          if (item.groups) {
            return item.groups.map((group: any) => group.name).join(", ");
          }
          return "";
        },
      },
    ],
    []
  );

  // const onChangeText = (
  //   ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   text: string
  // ): void => {
  //   setUsers(
  //     text
  //       ? users.filter((i) => i.displayName.toLowerCase().indexOf(text) > -1)
  //       : users
  //   );
  // };

  return (
    <div style={{ padding: 16 }}>
      <PrimaryButton
        onClick={() => {
          history.push(`${pathname}/new`);
        }}
      >
        New User
      </PrimaryButton>

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
          <EditUser />
        </Panel>
      </Route>
      <div>
        <TextField label="Filter by name:" styles={controlStyles} />
        <Announced
          message={`Number of items after filter applied: ${users.length}.`}
        />
      </div>
      <DetailsList
        styles={{ root: { height: height - 100 } }}
        items={users}
        columns={columns}
        setKey="id"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.single}
        checkButtonAriaLabel="Row checkbox"
        onActiveItemChanged={(change: any) => {
          history.push(`${pathname}/edit/${change.id}`);
        }}
      />
    </div>
  );
}

export default Users;
