var http = require("http");
var express = require("express");

var app = express();
var server = http.createServer(app);

var config = {
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || "localhost",
};
app.use(express.json());

app.get("/", function (req, res) {
    res.send("Hello World");
});

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
        res.status(404).send("Module not found");
    }
    module(req, res, next);
});

server.listen(config.PORT, function () {
    console.log(`Server is running on port ${config.PORT}`);
    console.log(`http://${config.HOST}:${config.PORT}`);
});
