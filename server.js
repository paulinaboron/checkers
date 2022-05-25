var express = require("express")
var app = express()
const PORT = process.env.PORT
var path = require("path")

app.use(express.static('static'))
app.use(express.json())

const e = require("express");

let playerMadeMove = false
let movedPawn = null
let movedPawnX = 0
let movedPawnZ = 0

let players = []

let pawnToDelete = null
let winner = null


let currentTab = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
]

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))

})

app.post("/ADD_USER", (req, res) => {
    console.log(req.body, "body");

    if(players.length == 0){
        players[0] = req.body.username
        res.send({ nrOfPlayers: 1, username: req.body.username })
    }else if(players.length == 1){
        if(players[0] == req.body.username){
            res.send({ nrOfPlayers: 999, username: req.body.username })
        }else{
            players[1] = req.body.username
        res.send({ nrOfPlayers: 2, username: req.body.username })
        }
    }else {
        res.send({ nrOfPlayers: 3, username: null })
    }
})

app.post("/REMOVE_ALL", (req, res) => {

    players = []

    currentTab = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]
    ]

    winner = null
    score = 0

    res.send({ "usunięto": "wszystko" })
})

app.post("/WAITING", (req, res) => {
    res.send({ nrOfPlayers: players.length })
})

app.post("/GET_TAB_INFO", (req, res) => {
    res.send({ currTab: currentTab })
})

app.post("/PAWN_MOVED", (req, res) => {
    res.send(req.body)

    let oldX = req.body.oldPos.x
    let oldZ = req.body.oldPos.z

    let newX = req.body.newPos.x
    let newZ = req.body.newPos.z

    movedPawnX = req.body.newPos.x
    movedPawnZ = req.body.newPos.z

    oldX = (oldX + 70) / 20
    oldZ = (oldZ + 70) / 20
    newX = (newX + 70) / 20
    newZ = (newZ + 70) / 20

    console.log(oldX, oldZ, newX, newZ);

    let temp = currentTab[oldZ][oldX]
    currentTab[oldZ][oldX] = 0
    currentTab[newZ][newX] = temp

    playerMadeMove = true
    movedPawn = req.body.pawn
})

app.post("/END_OF_GAME", (req, res) => {
    winner = req.body.winner
    res.send(req.body)
})

app.post("/GET_WINNER", (req, res) => {
    let msg = JSON.stringify({"winner": winner})
    res.send(msg)
})

app.post("/REMOVE_FROM_TAB", (req, res) => {
    console.log(currentTab[req.body.z][req.body.x], "nr");
    currentTab[req.body.z][req.body.x] = 0

    res.send(req.body)
})

app.post("/DELETE_PAWN", (req, res) => {
    pawnToDelete = req.body.pName
    res.send(req.body)
})

app.post("/WAITING_FOR_MOVE", (req, res) => {
    res.send({ moveDone: playerMadeMove, pawn: movedPawn, pos: { x: movedPawnX, z: movedPawnZ }, pawnNameToDelete: pawnToDelete })
    playerMadeMove = false
    pawnToDelete = null
})



app.listen(PORT || 3000, function () {
    console.log("start serwera na porcie " + PORT + " lub 3000")
})
