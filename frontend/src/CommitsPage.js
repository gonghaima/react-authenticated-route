import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { commits } from "./requests";
import Card from "react-bootstrap/Card";
import LoggedInTopBar from "./LoggedInTopBar";
const moment = require("moment");
function CommitsPage({ match: { params } }) {
    const [initialized, setInitialized] = useState(false);
    const [repoCommits, setRepoCommits] = useState([]);
    const getCommits = async page => {
        const repoName = params.repoName;
        const response = await commits(repoName, page);
        setRepoCommits(response.data.values);
    };
    useEffect(() => {
        if (!initialized) {
            getCommits(1);
            setInitialized(true);
        }
    });
    return (
        <>
            <LoggedInTopBar />
            <div className="page">
                <h1 className="text-center">Commits</h1>
                {repoCommits.map(rc => {
                    return (
                        <Card style={{ width: "90vw", margin: "0 auto" }}>
                            <Card.Body>
                                <Card.Title>{rc.message}</Card.Title>
                                <p>Message: {rc.author.raw}</p>
                                <p>
                                    Date:{" "}
                                    {moment(rc.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                                </p>
                                <p>Hash: {rc.hash}</p>
                            </Card.Body>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
export default withRouter(CommitsPage);