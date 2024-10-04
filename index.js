var http = require("http");
var cors = require("cors");
var express = require("express");
var jwt = require("jsonwebtoken");

var app = express();
var server = http.createServer(app);

var config = {
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || "localhost",
    TOKEN: process.env.TOKEN || "secrettokenhere",
    SERVE_ASSETS: process.env.SERVE_ASSETS || "true",
    ASSERTS_PATH: process.env.ASSERTS_PATH || "public",
    NONEXPIRING_TOKENS: process.env.NONEXPIRING_TOKENS || null,
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.send("Hello World");
});

////////////////    CORS    //////////////////
app.use(cors());

////////////////    ignored route    //////////////////
const ignoredRoutes = [
    {
        name: "/favicon.ico",
        method: ["GET"],
    },
    {
        name: "/auth",
        method: ["POST", "GET"],
    },
];

app.use(function (req, res, next) {
    var ignoredRoute = ignoredRoutes.find(
        (route) =>
            route.name == req.url.split("?")[0] &&
            route.method.includes(req.method)
    );
    if (ignoredRoute) {
        res.status(404).send("Not Found");
    } else {
        next();
    }
});

////////////////    public asset    //////////////////
if (config.SERVE_ASSETS == "true") {
    app.use("/public", express.static("public"));
    app.use("/public", function (req, res) {
        res.status(404).send("Not Found");
    });
}

////////////////    auth    //////////////////
const router = require("./routes/auth");
app.use("/auth", router);
app.use(function (req, res, next) {
    var token = req.headers["authorization"];
    if (!token) {
        res.status(401).send("Unauthorized");
    } else {
        if (
            token &&
            config.NONEXPIRING_TOKENS &&
            token.split(" ")[1] == config.NONEXPIRING_TOKENS
        ) {
            next();
        } else {
            jwt.verify(
                token.split(" ")[1],
                config.TOKEN,
                function (err, decoded) {
                    if (err) {
                        res.status(401).send("Unauthorized");
                    } else {
                        next();
                    }
                }
            );
        }
    }
});

////////////////    reset database    //////////////////
app.post("/reset", function (req, res) {
    inMemoryDatabase = {};
    res.send("Database reset");
});

////////////////    dynamic module    //////////////////
var routes = require("./routes/base");
var inMemoryDatabase = {};

// the module will be dynamically loaded when the route is accessed
app.use("/:module", function (req, res, next) {
    var module = req.params.module;
    try {
        if (!inMemoryDatabase[module]) {
            inMemoryDatabase[module] = require(`./data/${module}.json`);
        }
        module = routes(module, inMemoryDatabase[module]);
    } catch (error) {
        console.log("error", error);
        res.status(404).send("Module not found");
    }
    module(req, res, next);
});

server.listen(config.PORT, function () {
    console.log(`Server is running on port ${config.PORT}`);
    console.log(`http://${config.HOST}:${config.PORT}`);
});
