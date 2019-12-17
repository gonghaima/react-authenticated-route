import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import {
    currentUser,
    setBitbucketCredentials,
    changePassword
} from "./requests";
import LoggedInTopBar from "./LoggedInTopBar";
const userFormSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required")
});
const bitBucketFormSchema = yup.object({
    bitBucketUsername: yup.string().required("Username is required"),
    bitBucketPassword: yup.string().required("Password is required")
});
function SettingsPage() {
    const [initialized, setInitialized] = useState(false);
    const [user, setUser] = useState({});
    const [bitbucketUser, setBitbucketUser] = useState({});
    const handleUserSubmit = async evt => {
        const isValid = await userFormSchema.validate(evt);
        if (!isValid) {
            return;
        }
        try {
            await changePassword(evt);
            alert("Password changed");
        } catch (error) {
            alert("Password change failed");
        }
    };
    const handleBitbucketSubmit = async evt => {
        const isValid = await bitBucketFormSchema.validate(evt);
        if (!isValid) {
            return;
        }
        try {
            await setBitbucketCredentials(evt);
            alert("Bitbucket credentials changed");
        } catch (error) {
            alert("Bitbucket credentials change failed");
        }
    };
    const getCurrentUser = async () => {
        const response = await currentUser();
        const { username, bitBucketUsername } = response.data;
        setUser({ username });
        setBitbucketUser({ bitBucketUsername });
    };
    useEffect(() => {
        if (!initialized) {
            getCurrentUser();
            setInitialized(true);
        }
    });
    return (
        <>
            <LoggedInTopBar />
            <div className="page">
                <h1 className="text-center">Settings</h1>
                <h2>User Settings</h2>
                <Formik
                    validationSchema={userFormSchema}
                    onSubmit={handleUserSubmit}
                    initialValues={user}
                    enableReinitialize={true}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        isInvalid,
                        errors
                    }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="username">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            value={values.username || ""}
                                            onChange={handleChange}
                                            isInvalid={touched.username && errors.username}
                                            disabled
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.username}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={values.password || ""}
                                            onChange={handleChange}
                                            isInvalid={touched.password && errors.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Button type="submit" style={{ marginRight: "10px" }}>
                                    Save
              </Button>
                            </Form>
                        )}
                </Formik>
                <br />
                <h2>BitBucket Settings</h2>
                <Formik
                    validationSchema={bitBucketFormSchema}
                    onSubmit={handleBitbucketSubmit}
                    initialValues={bitbucketUser}
                    enableReinitialize={true}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        isInvalid,
                        errors
                    }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Row>
                                    <Form.Group as={Col} md="12" controlId="bitBucketUsername">
                                        <Form.Label>BitBucket Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="bitBucketUsername"
                                            placeholder="BitBucket Username"
                                            value={values.bitBucketUsername || ""}
                                            onChange={handleChange}
                                            isInvalid={
                                                touched.bitBucketUsername && errors.bitBucketUsername
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.bitBucketUsername}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="12" controlId="bitBucketPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="bitBucketPassword"
                                            placeholder="Bitbucket Password"
                                            value={values.bitBucketPassword || ""}
                                            onChange={handleChange}
                                            isInvalid={
                                                touched.bitBucketPassword && errors.bitBucketPassword
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.bitbucketPassword}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Button type="submit" style={{ marginRight: "10px" }}>
                                    Save
              </Button>
                            </Form>
                        )}
                </Formik>
            </div>
        </>
    );
}
export default SettingsPage;