# Dolby.io Classroom App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Cloning the Repository

Run the following:
```sh
git clone https://github.com/dolbyio-samples/meet-dolbyio-classroom.git
cd meet-dolbyio-classroom
```

## Setting Credentials

Before using the SDK in your project, find your **Consumer Key** and **Consumer Secret** by following these steps:

1. Select the `SIGN IN` link located in the upper right corner of the Dolby.io page. Log in using your email and password.
2. Click the `DASHBOARD` link visible in the upper right corner of the website.
3. Select your application from the `APPLICATIONS` category located on the left side menu.
4. Select the `API Keys` category from the drop-down menu visible under your application.
5. In the `Interactivity APIs` section, you can access your `Consumer Key` and `Consumer Secret`.

Ensure that you enter in your Dolby.io Credentials in `/src/utils/voxeetUtils.js`. That is, replace the placeholder text in:
```js
const consumerKey = '<DOLBYIO_COMMUNICATIONS_API>';
const consumerSecret = '<DOLBYIO_COMMUNICATIONS_SECRET>';
```
with the credentials from your application, found [here](https://dolby.io/signin).

Firebase credentials are currently defined in `src/providers/Firebase.js`.

To migrate to a different Firebase account:

* Log into the [Firebase Console](https://console.firebase.google.com/), click "Create a Project."

![image](https://user-images.githubusercontent.com/68416/130151392-85514273-54da-4cd2-aaab-5178a5e0764a.png)

* Give the project a name.

![image](https://user-images.githubusercontent.com/68416/130151479-67d51ecf-cf0a-4354-83e8-580deac3d49c.png)

* Accept the terms by checking the check box and click "Continue."

![image](https://user-images.githubusercontent.com/68416/130151530-225b2cd6-b4fb-45ed-a049-707a61aef471.png)

* On the next screen, unselect Google Analytics (unless you want that), and click "Continue."

![image](https://user-images.githubusercontent.com/68416/130151631-46855e28-e572-4c66-8038-daeba560f89c.png)

* Wait until it is set up and click "Continue."

![image](https://user-images.githubusercontent.com/68416/130154194-298e32f8-8f0c-44b2-8a6d-dcba10a0cd5e.png)

* Click the "</>" icon to add a Web App.

![image](https://user-images.githubusercontent.com/68416/130153939-17d727ab-1735-4a10-9083-57f4c7b85c3f.png)

* Type a name for the app and click "Register app."

![image](https://user-images.githubusercontent.com/68416/130154032-dd79ae95-5d05-415a-8643-1848b9a2c909.png)

* Copy the details provided on this screen and paste them into the codebase where Firebase is configured (typically located in `src/providers/Firebase.js`).

* If you try running the app at this point, you'll get an error that looks like this: `@firebase/database: FIREBASE WARNING: Firebase error. Please ensure that you spelled the name of your Firebase correctly`. This is because we have not set up the Realtime database yet.

![image](https://user-images.githubusercontent.com/68416/130500963-e14614f9-467f-40ab-ac15-0da32920670c.png)

* Click "Build" and then "Realtime Database."

![image](https://user-images.githubusercontent.com/68416/130501091-3c83249a-b550-4aaa-b42e-25604c7b69ae.png)

* Click "Realtime Database."

![image](https://user-images.githubusercontent.com/68416/130501245-080b22e0-a240-4bc2-b029-8cc5c14046fe.png)

* Click "Create Database."

![image](https://user-images.githubusercontent.com/68416/130501302-444d5f57-0550-44f7-bd71-d77c9b3e6e01.png)

 * Click "Next" and accept the default setting.

![image](https://user-images.githubusercontent.com/68416/130501463-e364e884-665e-4c9d-aae0-74e2a14b270f.png)

 * Click "Start in test mode", then click "Enable."

Now the app should connect to Firebase.

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
  
## Running the Application

After all credentials are set, you can run with:
```js
npm install
npm run start
```
