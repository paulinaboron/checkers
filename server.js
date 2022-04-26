var express = require("express")
var app = express()
const PORT = 3000;
var path = require("path")

app.use(express.static('static'))
app.use(express.json())


const Datastore = require('nedb')

const players = new Datastore({
    filename: 'players.db',
    autoload: true
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))

})

app.post("/ADD_USER", (req, res) => {
    console.log(req.body, "body");

    let playersCount
    players.count({}, function (err, count) {
        playersCount = count
        console.log("players", playersCount);



        if (playersCount == 0) {
            let doc = {
                username: req.body.username,
                color: "white"
            }
            players.insert(doc, function (err, newDoc) {
                console.log("dodano dokument (obiekt): ", newDoc)

                players.count({}, function (err, count) {
                    console.log("dokumentów jest: ", count)
                    res.send({ nrOfPlayers: count, username: req.body.username })
                });
            });
        } else if (playersCount == 1) {
            // players.find({ username: req.body.username }, function (err, docs) {
            //     if (docs == []) {
            //         let doc = {
            //             username: req.body.username,
            //             color: "black"
            //         }
            //         players.insert(doc, function (err, newDoc) {
            //             console.log("dodano dokument (obiekt): ", newDoc)

            //             players.count({}, function (err, count) {
            //                 console.log("dokumentów jest: ", count)
            //                 res.send({ nrOfPlayers: count, username: req.body.username })
            //             });
            //         });
            //     }
            // });
            let doc = {
                username: req.body.username,
                color: "black"
            }
            players.insert(doc, function (err, newDoc) {
                console.log("dodano dokument (obiekt): ", newDoc)

                players.count({}, function (err, count) {
                    console.log("dokumentów jest: ", count)
                    res.send({ nrOfPlayers: count, username: req.body.username })
                });
            });
        }
    });
})

app.post("/REMOVE_ALL", (req, res) => {
    players.remove({}, { multi: true }, function (err, numRemoved) {
        console.log("usunięto wszystkie dokumenty: ", numRemoved)
    });

    res.send("usunięto wszystko")
})

app.post("/WAITING", (req, res) => {
    players.count({}, function (err, count) {
        res.send({ nrOfPlayers: count })
    });
})



app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
