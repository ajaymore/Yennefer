import React, { useState, useEffect, useMemo } from 'react';
import firebase from 'firebase/app';
import {
  TextField,
  MessageBar,
  MessageBarType,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Panel,
  PrimaryButton
} from '@fluentui/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useHistory, useRouteMatch, Route } from 'react-router-dom';
import EditGroup from './EditGroup';
import { useWindowSize } from '../../hooks/useWindowSize';

type Groups = { name: string; id: string }[];

function Groups() {
  const { height } = useWindowSize();
  const [groups, setGroups] = useState<Groups>([]);
  const history = useHistory();
  const { path } = useRouteMatch();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('groups')
      .orderBy('name', 'asc')
      .onSnapshot(querySnapshot => {
        let array: any = [];
        querySnapshot.forEach(doc => {
          array = [...array, { id: doc.id, key: doc.id, ...doc.data() }];
        });
        setGroups(array);
      });
    return unsubscribe;
  }, []);

  const columns = useMemo(
    () => [
      {
        key: 'column1',
        name: 'Name',
        fieldName: 'name',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      }
    ],
    []
  );

  return (
    <div style={{ boxSizing: 'border-box', padding: 16 }}>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={() =>
          Yup.object({
            name: Yup.string()
              .label('Group name')
              .min(4)
              .required()
          })
        }
        onSubmit={async (values, actions) => {
          actions.setStatus(null);
          actions.resetForm();
          try {
            await firebase
              .firestore()
              .collection('groups')
              .add({ name: values.name });
            actions.setStatus({
              message: 'Group added successfully!',
              type: 'Success'
            });
          } catch (err) {
            actions.setStatus({
              message: 'There was a problem adding the group!',
              type: 'Error'
            });
          }
        }}
      >
        {formikProps => (
          <Form>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end'
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <TextField
                  placeholder="Enter group name"
                  required
                  label="Group name"
                  name="name"
                  value={formikProps.values.name}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  errorMessage={
                    formikProps.touched.name ? formikProps.errors.name : ''
                  }
                />
              </div>
              &nbsp;&nbsp;
              <PrimaryButton type="submit">Add</PrimaryButton>
            </div>
            {formikProps.status && (
              <div style={{ marginTop: 4 }}>
                <MessageBar
                  messageBarType={
                    formikProps.status.type === 'Error'
                      ? MessageBarType.error
                      : MessageBarType.success
                  }
                  isMultiline={false}
                  dismissButtonAriaLabel="Close"
                  onDismiss={() => {
                    formikProps.setStatus(null);
                  }}
                >
                  {formikProps.status.message}
                </MessageBar>
                <br />
              </div>
            )}
          </Form>
        )}
      </Formik>
      <DetailsList
        styles={{ root: { height: height - 100 } }}
        items={groups}
        columns={columns}
        setKey="id"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.single}
        checkButtonAriaLabel="Row checkbox"
        onActiveItemChanged={(change: any) => {
          history.push(`${path}/${change.id}`);
        }}
      />
      <Route path={`${path}/:id`}>
        <Panel
          headerText="Update Group"
          isOpen={true}
          onDismiss={() => {
            history.push(path);
          }}
          // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
          closeButtonAriaLabel="Close"
        >
          <EditGroup />
        </Panel>
      </Route>
    </div>
  );
}

export default Groups;
