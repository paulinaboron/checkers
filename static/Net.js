import { ui } from "./Main.js"

class Net {

    constructor() {
    }



    addPlayer(username) {

        const body = JSON.stringify({ "username": username }) // body czyli przesyłane na serwer dane

        const headers = { "Content-Type": "application/json" } // nagłowek czyli typ danych

        fetch("/ADD_USER", { method: "post", body, headers }) // fetch
            .then(response => response.json())
            .then(
                data => {
                    console.log(data, "data")
                    if (data.nrOfPlayers == 1) {
                        ui.onePlayer()
                        let info = "Hej " + data.username + ", grasz białymi"
                        ui.setStatus(info)

                        setInterval(function () {

                            const body = JSON.stringify({ w: 1 })
                            const headers = { "Content-Type": "application/json" }

                            fetch("/WAITING", { method: "post", body, headers })
                                .then(response => response.json())
                                .then(
                                    data => {
                                        console.log(data, "data")
                                    }
                                )

                        }, 1000);

                    } else if (data.nrOfPlayers == 2) {
                        ui.twoPlayers()
                        let info = "Hej " + data.username + ", grasz czarnymi"
                        ui.setStatus(info)
                    }
                    else {
                        console.log("more");
                        ui.setStatus("Gra juz trwa")
                    }
                } // dane odpowiedzi z serwera
            )

    }

    removeAllPlayers() {
        const body = JSON.stringify({ x: 1 })
        const headers = { "Content-Type": "application/json" }

        fetch("/REMOVE_ALL", { method: "post", body, headers })
            .then(response => response.json())
            .then(
                data => {
                    console.log(data, "data")
                }
            )
    }
}

export { Net }