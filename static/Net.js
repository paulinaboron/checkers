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
                        let info = "Hi " + data.username + ", you're playing with white pawns"
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
                                            ui.setStatus("2nd player joined")
                                            ui.stopWaiting()
                                            game.enableSceneClick()
                                        }
                                    }
                                )

                        }, 1000);

                    } else if (data.nrOfPlayers == 2) {
                        ui.twoPlayers()
                        let info = "Hi " + data.username + ", you're playing with black pawns"
                        sessionStorage.setItem('side', 'black');
                        ui.setStatus(info)
                    }
                    else if(data.nrOfPlayers == 999){
                        ui.setStatus("Input different username")
                    }
                    else {
                        ui.setStatus("Game already started")
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