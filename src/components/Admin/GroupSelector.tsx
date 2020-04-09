import React, { useEffect, useState, useCallback } from "react";
import firebase from "firebase/app";
import { TagPicker, ITag } from "@fluentui/react";

function GroupSelector(props: { formikProps: any }) {
  const [groups, setGroups] = useState<any>([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("groups")
      .get()
      .then((dataSnapshot) => {
        let tempArray: any = [];
        dataSnapshot.forEach((doc) => {
          tempArray.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setGroups(tempArray);
      });
  }, []);

  const onFilterChanged: any = useCallback(
    (filterText: string, tagList: ITag[]): ITag[] => {
      return filterText
        ? groups.filter((group: any) =>
            group.name.toLowerCase().includes(filterText.toLowerCase())
          )
        : [];
    },
    [groups]
  );

  return (
    <div>
      <TagPicker
        removeButtonAriaLabel="Remove"
        onResolveSuggestions={onFilterChanged}
        onChange={(change: any) => {
          if (!change.length) {
            return;
          }
          props.formikProps.setFieldValue(
            "groups",
            change.map((group: any) => {
              return { id: group.id, name: group.name };
            })
          );
        }}
        getTextFromItem={(group: any) => group.name}
        pickerSuggestionsProps={{
          suggestionsHeaderText: "Suggested Groups",
          noResultsFoundText: "No Groups Found",
        }}
        itemLimit={2}
        inputProps={{
          placeholder: "Enter Group Name to search",
          onBlur: (ev: React.FocusEvent<HTMLInputElement>) =>
            console.log("onBlur called"),
          onFocus: (ev: React.FocusEvent<HTMLInputElement>) =>
            console.log("onFocus called"),
          "aria-label": "Tag Picker",
        }}
      />
    </div>
  );
}

export default GroupSelector;
