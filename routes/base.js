const { randomUUID } = require("crypto");
const express = require("express");

function routes(MODEL_NAME, inMemoryDatabase, handler) {
    const router = express.Router();

    router.get("/", function (req, res) {
        if (handler && handler.GET) {
            handler.GET(req, res);
        } else {
            res.send(inMemoryDatabase);
        }
    });

    router.get("/:id", function (req, res) {
        var id = req.params.id;
        var model = inMemoryDatabase.find((model) => model.id == id);
        if (model) {
            res.send(model);
        } else {
            res.status(404).send(`${MODEL_NAME} not found`);
        }
    });

    router.post("/", function (req, res) {
        if (handler && handler.POST) {
            handler.POST(req, res);
        } else {
            var model = {
                ...req.body,
                id: randomUUID(),
                i_number: inMemoryDatabase.length,
            };
            inMemoryDatabase.push(model);
            res.send(model);
        }
    });

    router.put("/:id", function (req, res) {
        var id = req.params.id;
        var model = inMemoryDatabase.find((model) => model.id == id);
        if (model) {
            model = {
                ...model,
                ...req.body,
            };
            res.send(model);
        } else {
            res.status(404).send(`${MODEL_NAME} not found`);
        }
    });

    router.delete("/:id", function (req, res) {
        var id = req.params.id;
        var modelIndex = inMemoryDatabase.findIndex((model) => model.id == id);
        if (modelIndex >= 0) {
            userInMemoryDatabase.splice(modelIndex, 1);
            res.send(`${MODEL_NAME} deleted`);
        } else {
            res.status(404).send(`${MODEL_NAME} not found`);
        }
    });

    return router;
}

module.exports = routes;
