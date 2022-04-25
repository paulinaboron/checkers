import {net, game} from "./Main.js"

class Ui{

    constructor() {

        document.getElementById("login").onclick = this.loginClick
        document.getElementById("reset").onclick = this.resetClick
    }


    loginClick() {
        let username = document.getElementById("username").value
        console.log(username);

        net.addPlayer(username)
    }

    resetClick(){
        net.removeAllPlayers()
    }

    onePlayer(){
        console.log("1 player");
        game.setPawns()
        document.getElementById("menu").classList.add("hidden")
        document.getElementById("wait").classList.remove("hidden")

        game.setCamera1()
    }

    twoPlayers(){
        console.log("2 players");
        game.setPawns()
        document.getElementById("menu").classList.add("hidden")

        game.setCamera2()
    }

    moreThanTwoPlayers(){
        console.log("3 & more");
    }

    setStatus(info){
        document.getElementById("status").innerText = info
    }
}

export {Ui}