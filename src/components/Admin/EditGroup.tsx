import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Formik, Form } from 'formik';
import firebase from 'firebase/app';
import * as Yup from 'yup';
import {
  TextField,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  IPersonaProps,
  IBasePickerSuggestionsProps,
  ValidationState,
  NormalPeoplePicker,
  IconButton
} from '@fluentui/react';
import { useParams } from 'react-router-dom';
import { useWindowSize } from '../../hooks/useWindowSize';

function validateInput(input: string): ValidationState {
  if (input.indexOf('@') !== -1) {
    return ValidationState.valid;
  } else if (input.length > 1) {
    return ValidationState.warning;
  } else {
    return ValidationState.invalid;
  }
}

function getTextFromItem(persona: IPersonaProps): string {
  return persona.text as string;
}

const suggestionProps: IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggested People',
  mostRecentlyUsedHeaderText: 'Suggested Contacts',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: false,
  suggestionsAvailableAlertText: 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: 'Suggested contacts'
};

function EditGroup() {
  const { height } = useWindowSize();
  const picker = useRef(null);
  const [group, setGroup] = useState<{
    name: string;
    users: { id: string; text: string; secondaryText: string }[];
  }>({ name: '', users: [] });
  const { id }: any = useParams();

  useEffect(() => {
    firebase
      .firestore()
      .collection('groups')
      .doc(id)
      .onSnapshot(documentSnapshot => {
        setGroup({
          ...documentSnapshot.data()
        } as any);
      });
  }, [id]);

  const onFilterChanged = useCallback(
    (
      filterText: string,
      currentPersonas?: IPersonaProps[],
      limitResults?: number
    ): IPersonaProps[] | PromiseLike<IPersonaProps[]> => {
      return firebase
        .firestore()
        .collection('users')
        .where('email', '>=', filterText)
        .limit(10)
        .get()
        .then(querySnapshot => {
          return querySnapshot.docs.map(doc => {
            return {
              imageInitials: doc
                .data()
                .displayName.slice(0, 2)
                .toUpperCase(),
              imageUrl: '',
              optionalText: 'Available at 4:00pm',
              presence: 2,
              secondaryText: doc.data().email,
              tertiaryText: 'In a meeting',
              text: doc.data().displayName,
              id: doc.id
            };
          });
        });
    },
    []
  );

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={group}
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
          (picker as any).current.removeItems(values.users);
          try {
            firebase
              .firestore()
              .collection('groups')
              .doc(id)
              .update({
                name: values.name,
                users: firebase.firestore.FieldValue.arrayUnion(...values.users)
              });
            if (values.users) {
              values.users.forEach(user => {
                firebase
                  .firestore()
                  .collection('users')
                  .doc(user.id)
                  .update({
                    groups: firebase.firestore.FieldValue.arrayUnion({
                      id,
                      name: group.name
                    })
                  });
              });
            }
            actions.setStatus({
              message: 'Group updated successfully!',
              type: 'Success'
            });
          } catch (err) {
            console.log(err);
            actions.setStatus({
              message: 'There was a problem updating the group!',
              type: 'Error'
            });
          }
        }}
      >
        {formikProps => (
          <Form>
            <br />
            <TextField
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
              </div>
            )}
            <br />
            <NormalPeoplePicker
              onResolveSuggestions={onFilterChanged}
              getTextFromItem={getTextFromItem}
              pickerSuggestionsProps={suggestionProps}
              className={'ms-PeoplePicker'}
              onValidateInput={validateInput}
              onChange={(change: any) => {
                if (!change.length) {
                  return;
                }
                formikProps.setFieldValue(
                  'users',
                  formikProps.values.users
                    ? formikProps.values.users.concat(change)
                    : change
                );
              }}
              //   onItemSelected={(item: any) => {
              //     firebase
              //       .firestore()
              //       .collection('groups')
              //       .doc(id)
              //       .update({
              //         users: firebase.firestore.FieldValue.arrayUnion(item)
              //       });
              //     firebase
              //       .firestore()
              //       .collection('users')
              //       .doc(item.id)
              //       .update({
              //         groups: firebase.firestore.FieldValue.arrayUnion(group)
              //       });
              //     return null;
              //   }}
              inputProps={{
                placeholder: 'Enter email ID to search'
                //   onBlur: (ev: React.FocusEvent<HTMLInputElement>) =>
                //     console.log('onBlur called'),
                //   onFocus: (ev: React.FocusEvent<HTMLInputElement>) =>
                //     console.log('onFocus called'),
                //   'aria-label': 'People Picker'
              }}
              componentRef={picker}
              resolveDelay={100}
            />
            <br />
            <div
              style={{
                height: height - 300,
                overflowY: 'scroll'
              }}
            >
              {group.users &&
                group.users.map(user => (
                  <div
                    key={user.id}
                    style={{
                      marginBottom: 8,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div className="ms-fontWeight-semibold ms-fontColor-gray220">
                        {user.text}
                      </div>
                      <div className="ms-fontSize-12 ms-fontColor-gray120">
                        {user.secondaryText}
                      </div>
                    </div>
                    <IconButton
                      onClick={() => {
                        firebase
                          .firestore()
                          .collection('groups')
                          .doc(id)
                          .update({
                            users: firebase.firestore.FieldValue.arrayRemove(
                              user
                            )
                          });
                        firebase
                          .firestore()
                          .collection('users')
                          .doc(user.id)
                          .update({
                            groups: firebase.firestore.FieldValue.arrayRemove(
                              group
                            )
                          });
                      }}
                      iconProps={{ iconName: 'Clear' }}
                      title="Clear"
                      ariaLabel="Clear"
                    />
                  </div>
                ))}
            </div>
            <br />
            <PrimaryButton type="submit" disabled={formikProps.isSubmitting}>
              Update
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditGroup;
