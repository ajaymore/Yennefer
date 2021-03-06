import React from "react";
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
} from "@fluentui/react";
import firebase from "firebase/app";
import GroupSelector from "./GroupSelector";

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
  { key: "Male", text: "Male" },
  { key: "Female", text: "Female" },
  { key: "Other", text: "Other" },
];

const controlClass = mergeStyleSets({
  control: {
    margin: "0 0 15px 0",
    maxWidth: "300px",
  },
});

function NewUser() {
  // email , phoneNumer , displayName, birthDate, Gender (Male, Female, Other), groups

  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          phoneNumber: "",
          displayName: "",
          birthDate: new Date(),
          gender: "Male",
          groups: [],
        }}
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
            const newUser = await firebase.firestore().collection("users").add({
              displayName: values.displayName,
              email: values.email,
              phoneNumber: values.phoneNumber,
              birthDate: values.birthDate,
              gender: values.gender,
              groups: values.groups,
            });
            await Promise.all(
              values.groups.map((group: any) => {
                firebase
                  .firestore()
                  .collection("groups")
                  .doc(group.id)
                  .update({
                    users: firebase.firestore.FieldValue.arrayUnion({
                      imageInitials: values.displayName
                        .slice(0, 2)
                        .toUpperCase(),
                      imageUrl: "",
                      optionalText: "Available at 4:00pm",
                      presence: 2,
                      secondaryText: values.email,
                      tertiaryText: "In a meeting",
                      text: values.displayName,
                      id: newUser.id,
                    }),
                  });
              })
            );
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
            <br />
            <TextField
              placeholder=" Enter a Name"
              required
              label="Name"
              name="displayName"
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
              selectedKey={formikProps.values.gender}
              options={options}
              name="gender"
              onChange={(ev: any, option: any) => {
                formikProps.setFieldValue("gender", option.key);
              }}
              label="gender"
              required={true}
            />
            <br />
            <GroupSelector formikProps={formikProps} />
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
            <PrimaryButton type="submit" disabled={formikProps.isSubmitting}>
              Submit
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default NewUser;
