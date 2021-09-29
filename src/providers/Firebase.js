import firebase from 'firebase/app';
import 'firebase/database';

// linked to marc@stamen.com - NOTE: this account is on the free setting only
// todo: get account details from dolby and hide key better.
// const firebaseConfig = {
//   apiKey: 'AIzaSyBSrZkEIj1EoqK1e9ncY5F1yc1i2QylDOk',
//   authDomain: 'dolby-classroom-app.firebaseapp.com',
//   projectId: 'dolby-classroom-app',
//   storageBucket: 'dolby-classroom-app.appspot.com',
//   messagingSenderId: '256120448382',
//   appId: '1:256120448382:web:e8f782b1bdefd2ff45bf2f',
// };

const firebaseConfig = {
  apiKey: "AIzaSyAx2k-49uKfFy0Z6j-Vi1HkZCaNI4l8Mfc",
  authDomain: "meet-dolby-io.firebaseapp.com",
  databaseURL: "https://meet-dolby-io-default-rtdb.firebaseio.com",
  projectId: "meet-dolby-io",
  storageBucket: "meet-dolby-io.appspot.com",
  messagingSenderId: "319145521255",
  appId: "1:319145521255:web:74da7107b1197e87b9a4c2",
  measurementId: "G-8MJKB3P0X9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

export { db };
