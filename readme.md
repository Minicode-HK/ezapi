# EZApi

Build a simple RESTful API with JSON data. The API does not require a database and provides endpoints for basic CRUD operations. All the data is stored in nodejs runtime memory.

Anytime you restart the server, the data will be reset. This is a good tool for testing and prototyping.

---

Btw, this is still a work in progress. Code is messy and not well-organized.

---

## Example Usage

You simply create an endpoint with a JSON file in the `data` directory. Then an API endpoint is ready to use.

```json
[
    {
      "id": 1,
      "name": "John Doe",
      "email": "123@minicodehk.com"
    }
]
```

You could also create a handler for the endpoint in the `routes` directory.

```javascript
const { randomUUID } = require("crypto");

export function route(inMemoryDatabase, dependencies) {
    function POST(req, res) {
        var model = {
            ...req.body,
            id: randomUUID(),
            i_number: inMemoryDatabase.data.length,
        };
        inMemoryDatabase.push(model);
        res.send(model);
    }
    return {
        GET: (req, res) => {
            res.send(inMemoryDatabase);
        },
        POST: POST,
    };
}
```
