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