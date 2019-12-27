import React from "react";
import { Redirect } from "react-router-dom";
function RequireAuth({ Component }) {
    if (!localStorage.getItem("token")) {
        return <Redirect to="/" />;
    }
    return <Component />;
}
export default RequireAuth;