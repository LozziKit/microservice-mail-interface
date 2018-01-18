# Introduction

This app allows the administration of the Lozzikit - Mail service. 
It was develloped during the TWEB course at the University of Applied Sciences of Yverdon.

# Installation

### `npm install`

Install the dependencies of the app.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

# Usage

For a correct usage of this app, the Lozzikit - Mail microservice must be running (for example with the docker-compose configuration file) and the app must be configured with the proper URL to reach the microservice.

If the microservice can't be reached at the same adress and port as the host of the app then the host must enable Cross-Origin Resource Sharing.

# Thanks

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

This project uses the following project:

* [Material-UI](https://material-ui-next.com/) for the user interface.
* [React Router DOM](https://reacttraining.com/react-router/) for the routing of the single-page.
* [Superagent](https://github.com/visionmedia/superagent) for the api request.
