import { game, ui } from "./Main.js"

class Net {

    constructor() {
    }



    addPlayer(username) {

        const body = JSON.stringify({ "username": username })
        const headers = { "Content-Type": "application/json" }

        fetch("/ADD_USER", { method: "post", body, headers })
            .then(response => response.json())
            .then(
                data => {
                    if (data.nrOfPlayers == 1) {
                        ui.onePlayer()
                        let info = "Hej " + data.username + ", grasz białymi"
                        sessionStorage.setItem('side', 'white');
                        ui.setStatus(info)

                        var interval = setInterval(function () {

                            const body = JSON.stringify({ w: 1 })
                            const headers = { "Content-Type": "application/json" }

                            fetch("/WAITING", { method: "post", body, headers })
                                .then(response => response.json())
                                .then(
                                    data => {
                                        if (data.nrOfPlayers == 2) {
                                            clearInterval(interval)
                                            ui.setStatus("Dołączył drugi gracz: ")
                                            ui.stopWaiting()
                                            game.enableSceneClick()
                                        }
                                    }
                                )

                        }, 1000);

                    } else if (data.nrOfPlayers == 2) {
                        ui.twoPlayers()
                        let info = "Hej " + data.username + ", grasz czarnymi"
                        sessionStorage.setItem('side', 'black');
                        ui.setStatus(info)
                    }
                    else if(data.nrOfPlayers == 999){
                        ui.setStatus("Wprowadź inny login")
                    }
                    else {
                        ui.setStatus("Gra juz trwa")
                    }
                }
            )

    }

    removeAllPlayers() {
        const body = JSON.stringify({ x: 1 })
        const headers = { "Content-Type": "application/json" }

        fetch("/REMOVE_ALL", { method: "post", body, headers })
            .then(response => response.json())
    }

    endOfGame(res){
        const body = JSON.stringify({winner: res})
        const headers = { "Content-Type": "application/json" }

        fetch("/END_OF_GAME", { method: "post", body, headers })
            .then(response => response.json())
    }
}

export { Net }