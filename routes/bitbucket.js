var express = require("express");
const models = require("../models");
const CryptoJS = require("crypto-js");
const Bitbucket = require("bitbucket");
const jwt = require("jsonwebtoken");
import { authCheck } from "../middlewares/authCheck";
const bitbucket = new Bitbucket();
var router = express.Router();
router.post("/setBitbucketCredentials", authCheck, async (req, res, next) => {
    const { bitBucketUsername, bitBucketPassword } = req.body;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId;
    const cipherText = CryptoJS.AES.encrypt(
        bitBucketPassword,
        process.env.CRYPTO_SECRET
    );
    await models.User.update(
        {
            bitBucketUsername,
            bitBucketPassword: cipherText.toString()
        },
        {
            where: { id }
        }
    );
    res.json({});
});
router.get("/repos/:page", authCheck, async (req, res, next) => {
    const page = req.params.page || 1;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId;
    const users = await models.User.findAll({ where: { id } });
    const user = users[0];
    const bytes = CryptoJS.AES.decrypt(
        user.bitBucketPassword.toString(),
        process.env.CRYPTO_SECRET
    );
    const password = bytes.toString(CryptoJS.enc.Utf8);
    bitbucket.authenticate({
        type: "basic",
        username: user.bitBucketUsername,
        password
    });
    let { data } = await bitbucket.repositories.list({
        username: user.bitBucketUsername,
        page,
        sort: "-updated_on"
    });
    res.json(data);
});
router.get("/commits/:repoName", authCheck, async (req, res, next) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId;
    const users = await models.User.findAll({ where: { id } });
    const user = users[0];
    const repoName = req.params.repoName;
    const bytes = CryptoJS.AES.decrypt(
        user.bitBucketPassword.toString(),
        process.env.CRYPTO_SECRET
    );
    const password = bytes.toString(CryptoJS.enc.Utf8);
    bitbucket.authenticate({
        type: "basic",
        username: user.bitBucketUsername,
        password
    });
    let { data } = await bitbucket.commits.list({
        username: user.bitBucketUsername,
        repo_slug: repoName,
        sort: "-date"
    });
    res.json(data);
});
module.exports = router;