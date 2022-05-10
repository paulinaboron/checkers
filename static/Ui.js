import { net, game } from "./Main.js"

class Ui {

    constructor() {

        document.getElementById("login").onclick = this.loginClick
        document.getElementById("reset").onclick = this.resetClick
    }


    loginClick() {
        let username = document.getElementById("username").value
        console.log(username);

        net.addPlayer(username)
    }

    resetClick() {
        net.removeAllPlayers()
    }

    onePlayer() {
        console.log("1 player");
        game.setPawns()
        document.getElementById("menu").classList.add("hidden")
        document.getElementById("wait").classList.remove("hidden")

        game.setCamera1()
        this.getTabInfo()
    }

    twoPlayers() {
        console.log("2 players");
        game.setPawns()
        document.getElementById("menu").classList.add("hidden")
        document.getElementById("clock").classList.remove("hidden")
        this.startTimer()

        game.setCamera2()
        game.enableSceneClick()
        this.getTabInfo()
    }

    stopWaiting() {
        document.getElementById("wait").classList.add("hidden")
    }

    moreThanTwoPlayers() {
        console.log("3 & more");
    }

    setStatus(info) {
        document.getElementById("status").innerText = info
    }

    getTabInfo() {
        document.getElementById("tab").innerHTML = ""

        const body = JSON.stringify({ x: 1 })
        const headers = { "Content-Type": "application/json" }

        fetch("/GET_TAB_INFO", { method: "post", body, headers })
            .then(response => response.json())
            .then(
                data => {
                    console.log(data, "data")
                    if (sessionStorage.getItem('side') == 'black') {
                        data.currTab.reverse()
                        data.currTab.forEach(element => {
                            document.getElementById("tab").innerHTML += element.reverse() + "</br>"
                        });
                    } else {
                        data.currTab.forEach(element => {
                            document.getElementById("tab").innerHTML += element + "</br>"
                        });
                    }

                }
            )
    }

    startTimer() {
        let nr = 30
        let interv = setInterval(function () {
            nr = document.getElementById("timer").innerText
            console.log(nr);

            document.getElementById("timer").innerText = --nr

        }, 1000);

        if (nr == 0) {
            this.stopTimer(interv)
            document.getElementById("timer").innerText = "Koniec czasu"
        }

    }

    stopTimer(interval) {
        clearInterval(interval);
    }
}

export { Ui }