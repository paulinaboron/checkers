import { net, game, ui } from "./Main.js";

class Ui {
  constructor() {
    document.getElementById("login").onclick = this.loginClick;
    document.getElementById("reset").onclick = this.resetClick;

    this.interv = null;
    this.getWinner();
  }

  loginClick() {
    let username = document.getElementById("username").value;
    net.addPlayer(username);
  }

  resetClick() {
    net.removeAllPlayers();
  }

  onePlayer() {
    game.setPawns();
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("wait").classList.remove("hidden");

    game.setCamera1();
    this.getTabInfo();
  }

  twoPlayers() {
    game.setPawns();
    document.getElementById("menu").classList.add("hidden");
    this.startTimer();

    game.setCamera2();
    game.enableSceneClick();
    this.getTabInfo();
  }

  stopWaiting() {
    document.getElementById("wait").classList.add("hidden");
  }

  setStatus(info) {
    document.getElementById("status").innerText = info;
  }

  getTabInfo() {
    document.getElementById("tab").innerHTML = "";

    const body = JSON.stringify({ x: 1 });
    const headers = { "Content-Type": "application/json" };

    fetch("/GET_TAB_INFO", { method: "post", body, headers })
      .then((response) => response.json())
      .then((data) => {
        game.pawnsArray = data.currTab;

        // if (sessionStorage.getItem('side') == 'black') {
        //   document.getElementById("tab").innerHTML = "";
        //   let tab = data.currTab
        //   tab.reverse().forEach((row) => {
        //     row.reverse().forEach((e) => {
        //       document.getElementById("tab").innerHTML += e + " ";
        //     })
        //     document.getElementById("tab").innerHTML += "</br>";
        //   });
        // } else {
        document.getElementById("tab").innerHTML = "";
        let tab = data.currTab
        tab.forEach((row) => {
          let line = document.createElement("p");
          row.forEach((e) => {
            if (e == 0)
              line.innerHTML += "<p>" + e + "</p>";
            else if (e == 1)
              line.innerHTML += "<p class='pinkNr'>" + e + "</p>";
            else if (e == 2)
              line.innerHTML += "<p class='blueNr'>" + e + "</p>";
          })
          document.getElementById("tab").appendChild(line)
        });
        // }
      });
  }

  startTimer() {
    document.getElementById("clock").classList.remove("hidden");
    game.sceneClickIsActive = false;
    let nr = 30;
    let interv = setInterval(function () {
      document.getElementById("timer").innerText = --nr;

      if (nr == 0) {
        clearInterval(interv);
        document.getElementById("timer").innerText = "Koniec czasu";
        net.endOfGame(sessionStorage.getItem("side"));
      }

      fetch("/WAITING_FOR_MOVE", { method: "post" })
        .then((response) => response.json())
        .then((data) => {
          if (data.moveDone == true) {
            clearInterval(interv);
            ui.getTabInfo();
            document.getElementById("clock").classList.add("hidden");
            game.sceneClickIsActive = true;

            let pawnToMove = game.scene.getObjectByName(data.pawn, true);

            if (data.pawnNameToDelete != null) {
              ui.deletePawn(data.pawnNameToDelete);
            }

            new TWEEN.Tween(pawnToMove.position) // co
              .to({ x: data.pos.x, z: data.pos.z }, 500) // do jakiej pozycji, w jakim czasie
              .repeat(0) // liczba powtórzeń
              .easing(TWEEN.Easing.Cubic.InOut) // typ easingu (zmiana w czasie)
              .start();
          }
        });
    }, 1000);
  }

  deletePawn(nameToDelete) {
    let pawnToDelete = game.scene.getObjectByName(nameToDelete, true);

    let idX = (pawnToDelete.position.x + 70) / 20;
    let idZ = (pawnToDelete.position.z + 70) / 20;
    game.pawnsArray[idZ][idX] = 0;

    const body = JSON.stringify({ x: idX, z: idZ });
    const headers = { "Content-Type": "application/json" };

    fetch("/REMOVE_FROM_TAB", { method: "post", body, headers })
      .then((response) => response.json())
      .then((data) => {
        ui.getTabInfo();
      });

    game.scene.remove(pawnToDelete);
  }


  getWinner() {
    let interv = setInterval(function () {
      fetch("/GET_WINNER", { method: "post" })
        .then((response) => response.json())
        .then((data) => {
          if (data.winner != null) {
            clearInterval(interv);
            document.getElementById("clock").classList.add("hidden");
            game.sceneClickIsActive = false;
            if (data.winner == sessionStorage.getItem('side')) {
              ui.setStatus("Wygrałeś!!!")
            } else {
              ui.setStatus("Przegrałeś :(")
            }
          }
        });
    }, 1000);
  }
}

export { Ui };
