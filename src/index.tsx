import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { firebaseConfig } from './keys';
import { initializeIcons } from '@fluentui/react/lib/Icons';

firebase.initializeApp(firebaseConfig);
initializeIcons(/* optional base url */);

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
