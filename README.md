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
