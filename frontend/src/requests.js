const axios = require("axios");
const APIURL = "http://localhost:3000";
axios.interceptors.request.use(
    config => {
        config.headers.authorization = localStorage.getItem("token");
        return config;
    },
    error => Promise.reject(error)
);
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.status == 401) {
            localStorage.clear();
        }
        return error;
    }
);
export const signUp = data => axios.post(`${APIURL}/users/signup`, data);
export const logIn = data => axios.post(`${APIURL}/users/login`, data);
export const changePassword = data =>
    axios.post(`${APIURL}/users/changePassword`, data);
export const currentUser = () => axios.get(`${APIURL}/users/currentUser`);
export const setBitbucketCredentials = data =>
    axios.post(`${APIURL}/bitbucket/setBitbucketCredentials`, data);
export const repos = page =>
    axios.get(`${APIURL}/bitbucket/repos/${page || 1}`);
export const commits = (repoName) =>
    axios.get(`${APIURL}/bitbucket/commits/${repoName}`);