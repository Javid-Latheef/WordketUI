import firebase from 'firebase';

// Your web app's Firebase configuration
const config = {
    apiKey: "AIzaSyCHL7ts5mvtKn85a592Ff62sUY4z-h2h_s",
    authDomain: "wordket-166207.firebaseapp.com",
    databaseURL: "https://wordket-166207.firebaseio.com",
    projectId: "wordket-166207",
    storageBucket: "wordket-166207.appspot.com",
    messagingSenderId: "647279862770",
    appId: "1:647279862770:web:224f9859e58c4b43bc416b",
    measurementId: "G-JDX4RR1S01"
  };
  // Initialize Firebase
  firebase.initializeApp(config);
  //firebase.analytics();

  export default firebase;