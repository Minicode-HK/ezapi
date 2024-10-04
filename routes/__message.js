const { randomUUID } = require("crypto");

function route(inMemoryDatabase) {
    function POST(req, res) {
        var model = {
            ...req.body,
            id: randomUUID(),
            i_number: inMemoryDatabase[0].data.length,
        };
        inMemoryDatabase[0].data.push(model);
        res.send({ model });
    }
    return {
        POST: POST,
    };
}

module.exports = route;
