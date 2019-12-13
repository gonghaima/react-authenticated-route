# How to Add Authenticated Routes to Your React App

Authenticated Reacts routes are easy to make with higher order components. Higher order components are components that takes components as props and return render a new component.

For example, to create an authenticated route, we can write:

```javascript
import React from "react";
import { Redirect } from "react-router-dom";
function RequireAuth({ Component }) {
  if (!localStorage.getItem("token")) {
    return <Redirect to="/" />;
  }
  return <Component />;
}
export default RequireAuth;
```

```RequireAuth``` is a component that takes a ```Component``` prop. ```Component``` is a prop that is a React component. We check if there’s an authentication token present in local storage, and if it is, then we render our route, the ```Component``` , that requires authentication. Otherwise we redirect to a route that doesn’t require authentication.

In this article, we will make a simple Bitbucket app with authenticated React routes. We will let users sign up for an account and set their Bitbucket username and password for their account. Once the user is logged in and set their Bitbucket credentials, they can view their repositories and the commits for each repository.

Bitbucket is a great repository hosting service that lets you host Git repositories for free. You can upgrade to their paid plans to get more features for a low price. It also has a comprehensive API for automation and getting data.

Developers have made Node.js clients for Bitbucket’s API. We can easily use it to do what we want like manipulating commits, adding, removing, or editing repositories, tracking issues, manipulating build pipelines and a lot more.

The Bitbucket.js package is one of the easiest packages to use for writing Node.js Bitbucket apps. All we have to do is log in with the Bitbucket instance with our Bitbucket username and password and call the built in functions listed at https://bitbucketjs.netlify.com/#api-_ to do almost anything we want with the Bitbucket packages.

Our app will consist of an back end and a front end. The back end handles the user authentication and communicates with Bitbucket via the Bitbucket API. The front end has the sign up form, log in form, a settings form for setting password and Bitbucket username and password.

To start building the app, we create a project folder with the ```backend``` folder inside. We then go into the ```backend``` folder and run the Express Generator by running ```npx express-generator``` . Next we install some packages ourselves. We need Babel to use ```import``` , BCrypt for hashing passwords, Bitbucket.js for using the Bitbucket API. Crypto-JS for encrypting and decrypting our Bitbucket password, Dotenv for storing hash and encryption secrets, Sequelize for ORM, JSON Web Token packages for authentication, CORS for cross domain communication and SQLite for database.

Run ```npm i @babel/cli @babel/core @babel/node @babel/preset-env bcrypt bitbucket cors crypto-js dotenv jsonwebtoken sequelize sqlite3``` to install the packages.

In the script section of package.json , put:

```shell
"start": "nodemon --exec npm run babel-node --  ./bin/www",
"babel-node": "babel-node"
```

to start our app with Babel Node instead of the regular Node.js runtime so that we get the latest JavaScript features.

Then we create a file called ```.babelrc``` in the ```backend``` folder and add:

```javascript
{
    "presets": [
        "@babel/preset-env"
    ]
}
```

to enable the latest features.

Then we have to add Sequelize code by running ```npx sequelize-cli init``` . After that we should get a ```config.json``` file in the config folder.

In config.json , we put:

```javascript
{
  "development": {
    "dialect": "sqlite",
    "storage": "development.db"
  },
  "test": {
    "dialect": "sqlite",
    "storage": "test.db"
  },
  "production": {
    "dialect": "sqlite",
    "storage": "production.db"
  }
}
```

To use SQLite as our database.

Next we add a ```middleware``` for verifying the authentication token, add a middllewares folder in the backend folder, and in there add ```authCheck.js``` . In the file, add:

```javascript
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
export const authCheck = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.send(401);
      } else {
        next();
      }
    });
  } else {
    res.send(401);
  }
};
```

We return 401 response if the token is invalid.

Next we create some migrations and models. Run:

```shell
npx sequelize-cli model:create --name User --attributes username:string,password:string,bitBucketUsername:string,bitBucketPassword:string
```

to create the model. Note that the attributes option has no spaces.

Then we add unique constraint to the ```username``` column of the Users table. To do this, run:

```npx sequelize-cli migration:create addUniqueConstraintToUser```

Then in newly created migration file, add:

```javascript
"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("Users", ["username"], {
      type: "unique",
      name: "usernameUnique"
    });
  },
down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint("Users", "usernameUnique");
  }
};
```

Run ```npx sequelize-cli db:migrate``` to run all the migrations.

Next we create the routes. Create a file called ```bitbucket.js``` and add:

In each route, we get the user from the token, since we will add the user ID into the token, and from there we get the Bitbucket username and password, which we use to log into the Bitbucket API. Note that we have to decrypt the password since we encrypted it before saving it to the database.

We set the Bitbucket credentials in the ```setBitbucketCredentials``` route. We encrypt the password before saving to keep it secure.

Then in the ```repos``` route, we get the repos of the user and sort by reversed ```update_on``` order since we specified ```-updated_on``` in the ```sort``` parameter. The commits are listed in reverse date order since we specified ```-date``` in the ```sort``` parameter.

Next we add the ```user.js``` in the ```routes``` folder and add:

```javascript
const express = require("express");
const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { authCheck } from "../middlewares/authCheck";
const router = express.Router();
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await models.User.create({ username, password: hashedPassword });
  res.json(user);
});
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const users = await models.User.findAll({ where: { username } });
  const user = users[0];
  await bcrypt.compare(password, user.password);
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token });
});
router.post("/changePassword", authCheck, async (req, res, next) => {
  const { password } = req.body;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded.userId;
  const hashedPassword = await bcrypt.hash(password, 10);
  await models.User.update({ password: hashedPassword }, { where: { id } });
  res.json({});
});
router.get("/currentUser", authCheck, async (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded.userId;
  const users = await models.User.findAll({ where: { id } });
  const { username, bitBucketUsername } = users[0];
  res.json({ username, bitBucketUsername });
});
module.exports = router;
```

We have routes for sign up, log in, and change password. We hash the password before saving when we sign up or changing password.

The ```currentUser``` route will be used for a settings form in the front end.

In ```app.js``` we replace the existing code with:

```javascript
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var bitbucketRouter = require("./routes/bitbucket");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/bitbucket", bitbucketRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
// render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
```

to add the CORS add-on to enable cross domain communication, and add the ```users``` and ```bitbucket``` routes in our app by adding:

```javascript
app.use("/users", usersRouter);
app.use("/bitbucket", bitbucketRouter);
```

This finishes the back end portion of the app. Now we can build the front end. We will build it with React, so we start by running ```npx create-react-app frontend``` from the project’s root folder.

Next we have to install some packages. We will install Bootstrap for styling, React Router for routing, Formik and Yup for form value handling and form validation respectively and Axios for making HTTP requests.

To do this run ```npm i axios bootstrap formik react-bootstrap react-router-dom yup``` to install all the packages.

Next we modify the ```App.js``` folder by replacing the existing code with the following:

```javascript
import React from "react";
import HomePage from "./HomePage";
import "./App.css";
import ReposPage from "./ReposPage";
import CommitsPage from "./CommitsPage";
import SettingsPage from "./SettingsPage";
import { createBrowserHistory as createHistory } from "history";
import { Router, Route } from "react-router-dom";
import SignUpPage from "./SignUpPage";
import RequireAuth from "./RequireAuth";
const history = createHistory();
function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Route path="/" exact component={HomePage} />
        <Route path="/signup" exact component={SignUpPage} />
        <Route
          path="/settings"
          component={props => (
            <RequireAuth {...props} Component={SettingsPage} />
          )}
        />
        <Route
          path="/repos"
          exact
          component={props => <RequireAuth {...props} Component={ReposPage} />}
        />
        <Route
          path="/commits/:repoName"
          exact
          component={props => (
            <RequireAuth {...props} Component={CommitsPage} />
          )}
        />
      </Router>
    </div>
  );
}
export default App;
```

We add the routes for the pages in our app here. ```RequiredAuth``` is a higher order component which takes a component that requires authentication to access and return redirect if not authorized or the page if the user is authorized. We pass in the components that requires authentication in this route, like ```ReposPage``` , ```SettingsPage``` and ```CommitPage``` .

[REF](https://medium.com/javascript-in-plain-english/how-to-add-authenticated-routes-to-your-react-app-f496ff266533)
