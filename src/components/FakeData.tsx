import React, { useState } from 'react';
import { Spinner, SpinnerSize, PrimaryButton } from '@fluentui/react';
import faker from 'faker';
import firebase from 'firebase/app';

function FakeData() {
  const [generating, setGenerating] = useState(false);

  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <PrimaryButton
        onClick={() => {
          setGenerating(true);
          Promise.all(
            Array.from(Array(50).keys()).map(() => {
              return firebase
                .firestore()
                .collection('users')
                .add({
                  displayName: faker.name.findName(),
                  email: faker.internet.email().toLowerCase(),
                  uid: faker.random.uuid()
                });
            })
          ).then(() => setGenerating(false));
        }}
      >
        Generate Data
      </PrimaryButton>
      <br />
      <br />
      {generating && (
        <Spinner size={SpinnerSize.large} label="Generating data" />
      )}
    </div>
  );
}

export default FakeData;
