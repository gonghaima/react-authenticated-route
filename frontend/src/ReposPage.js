import React, { useState, useEffect } from "react";
import { repos } from "./requests";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import LoggedInTopBar from "./LoggedInTopBar";
function ReposPage() {
    const [initialized, setInitialized] = useState(false);
    const [repositories, setRepositories] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const getRepos = async page => {
        const response = await repos(page);
        setRepositories(response.data.values);
        setTotalPages(Math.ceil(response.data.size / response.data.pagelen));
    };
    useEffect(() => {
        if (!initialized) {
            getRepos(1);
            setInitialized(true);
        }
    });
    return (
        <div>
            <LoggedInTopBar />
            <h1 className="text-center">Your Repositories</h1>
            {repositories.map((r, i) => {
                return (
                    <Card style={{ width: "90vw", margin: "0 auto" }} key={i}>
                        <Card.Body>
                            <Card.Title>{r.slug}</Card.Title>
                            <Link className="btn btn-primary" to={`/commits/${r.slug}`}>
                                Go
              </Link>
                        </Card.Body>
                    </Card>
                );
            })}
            <br />
            <Pagination style={{ width: "90vw", margin: "0 auto" }}>
                <Pagination.First onClick={() => getRepos(1)} />
                <Pagination.Prev
                    onClick={() => {
                        let p = page - 1;
                        getRepos(p);
                        setPage(p);
                    }}
                />
                <Pagination.Next
                    onClick={() => {
                        let p = page + 1;
                        getRepos(p);
                        setPage(p);
                    }}
                />
                <Pagination.Last onClick={() => getRepos(totalPages)} />
            </Pagination>
            <br />
        </div>
    );
}
export default ReposPage;