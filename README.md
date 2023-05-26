![](https://dolby.io/wp-content/uploads/2021/11/DolbyIO-Project-Gallery-Overview.jpg)

# Overview

This application demonstrates a few features that are helpful when building experiences such as an education themed classroom.

- voice and video chat
- fixed layout for known participants
- muted participants until moderator unmutes
- visual indicator when audio is transmitted
- screen sharing

Learn more about it from the blog post [Building a Classroom App](https://dolby.io/blog/building-a-classroom-app-with-moderation-and-assigned-seats-using-firebase/).

# Getting Started

This application was built as a react web application:

- uses the [Dolby.io Communications Web SDK](https://docs.dolby.io/communications-apis/docs/js-overview) for voice and video chat
- uses Firebase Real-time Database to maintain state
- bootstrapped with Create React App

Begin by cloning the repository:

```sh
git clone https://github.com/dolbyio-samples/comms-app-web-react-classroom
cd comms-app-web-react-classroom
```

## Dolby.io Configuration

Dolby.io credentials are asked in a `prompt()` popup upon loading the page. You can access the requested token from your dashboard by following [this documentation](https://docs.dolby.io/communications-apis/docs/guides-app-credentials).

Note the initialization method shown here is suitable for localhost testing only, please refer to our documentation for [initialization](https://docs.dolby.io/communications-apis/docs/initializing-javascript) best practices. You will want to be running a server-side component that can generate tokens for your application. You can find more [authentication samples](https://github.com/orgs/dolbyio-samples/repositories?q=topic%3Aauthentication&type=all&language=&sort=) for how to set these up.

## Firebase Configuration

Firebase credentials are defined in `src/providers/Firebase.js`.

1. Log into the [Firebase Console](https://console.firebase.google.com/) and click "Create a Project.".  Give the project a name such as "dolbyio-classroom-demo".  Accept the terms and click "Continue".
2. We recommend unselecting Google Analytics while in development, then click "Continue".
3. Click the "</>" icon to add a Web App (image below). Give your app a name such as "classroom-demo" and click "Register app".  You do not need Firebase Hosting at this point.
4. Copy the details provided in `firebaseConfig` on this screen and paste them into the `src/providers/Firebase.js` file.

You can replace the entire firebaseConfig object:
```
const firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "<PROJECT_ID>.firebaseapp.com",
  databaseURL: "<DATABASE_ID>.firebaseio.com",
  projectId: "<PROJECT_ID>",
  storageBucket: "<BUCKET>.appspot.com",
  messagingSenderId: "<MESSAGING_SENDER_ID>",
  appId: "<APP_ID>",
  measurementId: "<MEASUREMENT_ID>"
};
```
With your config object that you copied from the Firebase console.

* If you try running the app at this point, you'll get an error that looks like this: `@firebase/database: FIREBASE WARNING: Firebase error. Please ensure that you spelled the name of your Firebase correctly`. This is because we have not set up the Realtime database yet.

### Firebase Real-Time Database Setup

1. Continue to the Console and click "Build" and then "Realtime Database".

2. Click "Create Database". Click "Next" and accept the default setting.

3. Click "Start in test mode", then click "Enable."

Now the app should connect to Firebase.

## Data Model

For the Classroom App, the data model in Firebase looks like this:

* There are Firebase objects for each meeting room, the room id (cell) creates the key to the object in the Realtime Database
* Inside each meeting room key object there are two properties of note:
  * `classRoom` (object) contains information about all of the **student** seats
    * Inside each seat is
      * `isCalledOn` (boolean)
      * `isHandRaised` (boolean)
      * `name` (string)
      * `participantId` (string | `false`)
  * `teacherId` (string | `false`) contains the participant ID of the teacher, if the room has no teacher, this value is `false`

# Running the Application

After all credentials are set, you can run with:

```js
npm install
npm run start
```

This is what the result looks like:
![screenshot-of-running-app](https://dolby.io/wp-content/uploads/2021/11/classroom-screenshare-1024x680.png)

# Learn More

- [Building a Classroom App](https://dolby.io/blog/building-a-classroom-app-with-moderation-and-assigned-seats-using-firebase/)
- [Getting Started Documentation](https://docs.dolby.io/communications-apis/docs/getting-started-with-the-javascript-sdk)


# About Dolby.io

Using decades of Dolby's research in sight and sound technology, Dolby.io provides APIs to integrate real-time streaming, voice & video communications, and file-based media processing into your applications. [Sign up for a free account](https://dashboard.dolby.io/signup/) to get started building the next generation of immersive, interactive, and social apps.

<div align="center">
  <a href="https://dolby.io/" target="_blank"><img src="https://img.shields.io/badge/Dolby.io-0A0A0A?style=for-the-badge&logo=dolby&logoColor=white"/></a>
&nbsp; &nbsp; &nbsp;
  <a href="https://docs.dolby.io/" target="_blank"><img src="https://img.shields.io/badge/Dolby.io-Docs-0A0A0A?style=for-the-badge&logoColor=white"/></a>
&nbsp; &nbsp; &nbsp;
  <a href="https://dolby.io/blog/category/developer/" target="_blank"><img src="https://img.shields.io/badge/Dolby.io-Blog-0A0A0A?style=for-the-badge&logoColor=white"/></a>
</div>

<div align="center">
&nbsp; &nbsp; &nbsp;
  <a href="https://youtube.com/@dolbyio" target="_blank"><img src="https://img.shields.io/badge/YouTube-red?style=flat-square&logo=youtube&logoColor=white" alt="Dolby.io on YouTube"/></a>
&nbsp; &nbsp; &nbsp; 
  <a href="https://twitter.com/dolbyio" target="_blank"><img src="https://img.shields.io/badge/Twitter-blue?style=flat-square&logo=twitter&logoColor=white" alt="Dolby.io on Twitter"/></a>
&nbsp; &nbsp; &nbsp;
  <a href="https://www.linkedin.com/company/dolbyio/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white" alt="Dolby.io on LinkedIn"/></a>
</div>
