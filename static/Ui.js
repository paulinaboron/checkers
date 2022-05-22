import { net, game, ui } from "./Main.js"

class Ui {

    constructor() {

        document.getElementById("login").onclick = this.loginClick
        document.getElementById("reset").onclick = this.resetClick

        this.interv = null
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
                    game.pawnsArray = data.currTab
                    // if (sessionStorage.getItem('side') == 'black') {
                    //     let tempTab = data.currTab
                    //     tempTab.reverse()
                    //     tempTab.forEach(element => {
                    //         document.getElementById("tab").innerHTML += element.reverse() + "</br>"
                    //     });
                    // } else {
                        data.currTab.forEach(element => {
                            document.getElementById("tab").innerHTML += element + "</br>"
                        });
                    // }

                    

                }
            )
    }

    startTimer() {
        document.getElementById("clock").classList.remove("hidden")
        game.sceneClickIsActive = false
        let nr = 30
        let interv = setInterval(function () {

            document.getElementById("timer").innerText = --nr

            if (nr == 0) {
                clearInterval(interv);
                document.getElementById("timer").innerText = "Koniec czasu"
                net.endOfGame('lost')
            }

            fetch("/WAITING_FOR_MOVE", { method: "post" })
                .then(response => response.json())
                .then(
                    data => {
                        if (data.moveDone == true) {
                            clearInterval(interv);
                            ui.getTabInfo()
                            document.getElementById("clock").classList.add("hidden")
                            game.sceneClickIsActive = true

                            console.log(data.pawn);

                            let pawnToMove = game.scene.getObjectByName(data.pawn, true);
                            console.log(pawnToMove);

                            new TWEEN.Tween(pawnToMove.position) // co
                                .to({ x: data.pos.x, z: data.pos.z }, 500) // do jakiej pozycji, w jakim czasie
                                .repeat(0) // liczba powtórzeń
                                .easing(TWEEN.Easing.Cubic.InOut) // typ easingu (zmiana w czasie)
                                .onComplete(() => { console.log("koniec animacji") }) // funkcja po zakończeniu animacji
                                .start()

                        }
                    }
                )

        }, 1000);
    }

    stopTimer() {
        clearInterval(this.interv);
        document.getElementById("clock").classList.add("hidden")
        game.sceneClickIsActive = true
    }

}

export { Ui }