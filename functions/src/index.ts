import * as functions from 'firebase-functions';
import * as fetch from 'isomorphic-fetch';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
  fetch(
    'https://docs.microsoft.com/en-gb/academic-services/project-academic-knowledge/reference-interpret-method',
    {
      headers: {
        mode: 'no-cors',
        'Ocp-Apim-Subscription-Key': 'XXXXXXX'
      }
    }
  )
    .then(res => res.json())
    .then(data => {
      response.send(data);
    })
    .catch(err => {
      response.status(400).send(err);
    });
});
