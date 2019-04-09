var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');


var mimeTypes = {
    "js": "text/javascript",
    "css": "text/css",
    "png": "image/png",
    "jpeg": "image/jpeg",
    "mp3": "audio/mpeg",
    "gif": "image/gif"
}

var users = [];

var servResponse = (req, res) => {
    var allData = "";
    req.on("data", function (data) {
        console.log("data: " + data)
        allData += data;
    })

    req.on("end", function (data) {
        var body = qs.parse(allData)
        console.log(body)
        switch (body.action) {
            case "ADD_USER":
                if (users.length >= 2) {
                    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
                    res.end(JSON.stringify({ status: "GAME_IS_FULL" }))
                }
                else if (users.includes(body.user)) {
                    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
                    res.end(JSON.stringify({ status: "USER_WITH_THAT_NAME_ALREADY_EXISTS" }))
                }
                else {
                    users.push(body.user);
                    res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
                    res.end(JSON.stringify({
                        status: "USER_ADDED",
                        position: users.length,
                        enemy: users.length == 2 ? users[0] : null
                    }))
                }
                break;
            case "RESET":
                users = []
                res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
                res.end(JSON.stringify({ status: "RESET_HAVE_BEEN_DONE" }))
            case "PLAYER_PENDING":
                res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
                res.end(JSON.stringify({
                    length: users.length,
                    enemy: users.length == 2 ? users[1] : null
                }))
                break;
            default:
                res.writeHead(404, { 'Content-Type': 'application/json;charset=utf-8' });
                res.end(JSON.stringify({ error: "Error. Invalid request." }))
        }
    });
}


var readFile = (url) => {
    return new Promise(function (resolve, reject) {
        fs.readFile(url, function (error, data) {
            if (error) {
                reject(error)
            }
            else {
                resolve(data)
            }
        })
    })
}

var server = http.createServer(function (request, response) {
    switch (request.method) {
        case "GET":
            if (request.url == "/") {
                readFile("static/index.html")
                    .then((data) => {
                        response.writeHead(200, { 'Content-Type': 'text/html' });
                        response.write(data);
                        response.end();
                    })
            }
            else {
                readFile(path.join(__dirname, "static", decodeURI(request.url)))
                    .then((data) => {
                        var url = request.url.split(".")
                        var extension = url[url.length - 1]
                        var mimeType = mimeTypes[extension]
                        response.writeHead(200, { 'Content-Type': mimeType })
                        response.write(data)
                        response.end();
                    })
                    .catch((error) => {
                        console.log(error)
                        response.writeHead(404, { 'Content-Type': "text/plain" });
                        response.end("Eror 404: Page has not been found.")
                        return;
                    })
            }
            break;
        case "POST":
            servResponse(request, response)
            break;
    }
})

server.listen(3000, function () {
    console.log("Checkers server v0.1 starts on port 3000")
})