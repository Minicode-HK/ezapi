var express = require("express");
var jwt = require("jsonwebtoken");

var router = express.Router();

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN, { expiresIn: "3600s" });
}

router.post("/login", function (req, res) {
    var { username, password } = req.body;
    if (username == "admin" && password == "admin") {
        var token = generateAccessToken({ username });
        res.send({ token });
    } else {
        res.status(401).send("Invalid username or password");
    }
});

module.exports = router;
