const express = require("express");
const router = express.Router();

function route(inMemoryDatabase, dependencies) {
    function GET(req, res) {
        console.log(dependencies);
        const chat = dependencies["__message"];
        const newMessage = chat.map((element) => {
            return {
                id: element.id,
                message: element.data[element.data.length - 1].message,
                from: element.data[element.data.length - 1].message,
                unread: 1,
            };
        });
        res.send(newMessage);
    }
    return {
        GET: GET,
    };
}

module.exports = route;
