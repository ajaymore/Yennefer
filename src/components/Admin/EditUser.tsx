import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  PrimaryButton,
  IDatePickerStrings,
  mergeStyleSets,
  DatePicker,
  IChoiceGroupOption,
  ChoiceGroup,
  MessageBar,
  MessageBarType,
  IconButton,
} from "@fluentui/react";
import firebase from "firebase/app";
import { useParams } from "react-router-dom";
import GroupSelector from "./GroupSelector";
import { useWindowSize } from "../../hooks/useWindowSize";

const DayPickerStrings: IDatePickerStrings = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],

  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],

  shortDays: ["S", "M", "T", "W", "T", "F", "S"],

  goToToday: "Go to today",
  prevMonthAriaLabel: "Go to previous month",
  nextMonthAriaLabel: "Go to next month",
  prevYearAriaLabel: "Go to previous year",
  nextYearAriaLabel: "Go to next year",
  closeButtonAriaLabel: "Close date picker",
};

const options: IChoiceGroupOption[] = [
  { key: "A", text: "Male" },
  { key: "B", text: "Female" },
  { key: "C", text: "Other" },
];

const controlClass = mergeStyleSets({
  control: {
    margin: "0 0 15px 0",
    maxWidth: "300px",
  },
});

function EditUser() {
  const { height } = useWindowSize();
  const [user, setUser] = useState<{
    id: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    birthDate: Date;
    gender: string;
    groups: { id: string; name: string }[];
  }>({
    id: "",
    email: "",
    phoneNumber: "",
    displayName: "",
    birthDate: new Date(),
    gender: "",
    groups: [],
  });
  const { id }: any = useParams();

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(id)
      .onSnapshot((documentSnapshot) => {
        const { birthDate, ...rest }: any = documentSnapshot.data();
        setUser({
          ...rest,
          birthDate: birthDate ? birthDate.toDate() : new Date(),
        });
      });
  }, [id]);

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={user}
        validationSchema={() =>
          Yup.object({
            email: Yup.string().label("Email").required(),

            phoneNumber: Yup.number().label("Phone").required(),

            displayName: Yup.string().label("Name").required(),

            birthDate: Yup.string().label("Date").required(),

            gender: Yup.string().oneOf(["Male", "Female", "Other"]).required(),
          })
        }
        onSubmit={async (values, actions) => {
          console.log(values);
          actions.setStatus(null);
          actions.resetForm();

          try {
            firebase
              .firestore()
              .collection("users")
              .doc(id)
              .update({
                email: values.email,
                phoneNumber: values.phoneNumber,
                displayName: values.displayName,
                birthDate: values.birthDate,
                gender: values.gender,
                groups: firebase.firestore.FieldValue.arrayUnion(
                  ...values.groups
                ),
              });
            if (values.groups) {
              values.groups.forEach((group) => {
                firebase
                  .firestore()
                  .collection("groups")
                  .doc(group.id)
                  .update({
                    users: firebase.firestore.FieldValue.arrayUnion({
                      id,
                      displayname: user.displayName,
                    }),
                  });
              });
            }
            actions.setStatus({
              message: "added Successfully!",
              type: "Success",
            });
          } catch (err) {
            actions.setStatus({
              message: "there was problem while adding an User!!",
              type: "Error",
            });
          }
        }}
      >
        {(formikProps) => (
          <Form>
            {console.log(formikProps.values, formikProps.errors)}
            <br />
            <TextField
              placeholder=" Enter a Name"
              required
              label="Name"
              name="displayName"
              value={formikProps.values.displayName}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              errorMessage={
                formikProps.touched.displayName
                  ? formikProps.errors.displayName
                  : ""
              }
            />
            <br />
            <TextField
              placeholder="Enter a Email"
              required
              label="Email"
              name="email"
              value={formikProps.values.email}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              errorMessage={
                formikProps.touched.email ? formikProps.errors.email : ""
              }
            />
            <br />
            <TextField
              placeholder="Enter a Phone Number"
              required
              label="Phone"
              name="phoneNumber"
              value={formikProps.values.phoneNumber}
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              errorMessage={
                formikProps.touched.phoneNumber
                  ? formikProps.errors.phoneNumber
                  : ""
              }
            />
            <br />
            <DatePicker
              className={controlClass.control}
              label="Date"
              strings={DayPickerStrings}
              showWeekNumbers={true}
              firstWeekOfYear={1}
              showMonthPickerAsOverlay={true}
              placeholder="Select a date..."
              ariaLabel="Select a date"
              value={formikProps.values.birthDate}
              onSelectDate={(date) =>
                formikProps.setFieldValue("birthDate", date)
              }
            />
            <br />
            <ChoiceGroup
              defaultSelectedKey="A"
              options={options}
              onChange={formikProps.handleChange}
              label="Gender"
              required={true}
            />
            <br />

            {formikProps.status && (
              <div style={{ marginTop: 4 }}>
                <MessageBar
                  messageBarType={
                    formikProps.status.type === "Error"
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

            <GroupSelector formikProps={formikProps} />
            <br />

            <div
              style={{
                height: height - 300,
                overflowY: "scroll",
              }}
            >
              {user.groups &&
                user.groups.map((group) => (
                  <div
                    key={group.id}
                    style={{
                      marginBottom: 8,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div className="ms-fontWeight-semibold ms-fontColor-gray220">
                        {group.name}
                      </div>
                    </div>
                    <IconButton
                      onClick={() => {
                        firebase
                          .firestore()
                          .collection("groups")
                          .doc(id)
                          .update({
                            users: firebase.firestore.FieldValue.arrayRemove(
                              user
                            ),
                          });
                        firebase
                          .firestore()
                          .collection("users")
                          .doc(user.id)
                          .update({
                            groups: firebase.firestore.FieldValue.arrayRemove(
                              group
                            ),
                          });
                      }}
                      iconProps={{ iconName: "Clear" }}
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

export default EditUser;
