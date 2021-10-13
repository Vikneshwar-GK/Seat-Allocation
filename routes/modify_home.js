const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/", (req, res) => {
    res.render("modify_home", { layout: "loggedIn-layout" });
});

module.exports = router;