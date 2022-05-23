import { ui, game, net } from "./Main.js";

class Pionek extends THREE.Mesh {
  constructor(color, x, y, z, name) {
    super();
    this.name = name;
    this.geometry = new THREE.CylinderGeometry(7, 7, 7, 32);

    this.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x222222,
      shininess: 50,
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load(color),
    });

    this.position.set(x, y, z);

    this.side = color == "imgs/pink.jpg" ? "white" : "black";
  }

  selected() {
    game.scene.children.forEach((element) => {
      if (element.constructor.name == "Field")
        element.material.color = { r: 1, g: 1, b: 1 };
    });

    this.material.color = { r: 0.8, g: 0.6, b: 0.8 };
    console.log(this.name);
  }

  deselected() {
    this.material.color = { r: 1, g: 1, b: 1 };
  }

  move(pos, name) {
    console.log(game.deletingPawns, "+++++++");
    let fName = "f" + pos.z + "_" + pos.x;
    if (game.deletingPawns[fName] != undefined) {
      this.deletePawn(fName);
    }

    new TWEEN.Tween(this.position) // co
      .to({ x: pos.x, z: pos.z }, 500) // do jakiej pozycji, w jakim czasie
      .repeat(0) // liczba powtórzeń
      .easing(TWEEN.Easing.Cubic.InOut) // typ easingu (zmiana w czasie)
      .onComplete(() => {
        console.log("koniec animacji");
      }) // funkcja po zakończeniu animacji
      .start();

    const body = JSON.stringify({
      oldPos: this.position,
      newPos: { x: pos.x, y: 0, z: pos.z },
      pawn: name,
    });
    const headers = { "Content-Type": "application/json" };

    fetch("/PAWN_MOVED", { method: "post", body, headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data");
        ui.startTimer();
      });

    game.scene.children.forEach((element) => {
      if (element.constructor.name == "Field")
        element.material.color = { r: 1, g: 1, b: 1 };
    });

    game.fieldsOptions = [];
    game.deletingPawns = {};
  }

  deletePawn(fName) {
    let pawnName = game.deletingPawns[fName];
    let pawnToDelete = game.scene.getObjectByName(pawnName, true);
    game.score += 1;

    if(game.score == 1){
        net.endOfGame(sessionStorage.getItem('side'))
    }

    let idX = (pawnToDelete.position.x + 70) / 20;
    let idZ = (pawnToDelete.position.z + 70) / 20;
    game.pawnsArray[idZ][idX] = 0;
    console.log(idX, idZ);

    let body = JSON.stringify({ x: idX, z: idZ });
    console.log(body);
    const headers = { "Content-Type": "application/json" };

    fetch("/REMOVE_FROM_TAB", { method: "post", body, headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data");
        // ui.get
        
      });

    body = JSON.stringify({ pName: pawnName });

    fetch("/DELETE_PAWN", { method: "post", body, headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, "data");
      });

    game.scene.remove(pawnToDelete);
    ui.getTabInfo()

  }
}
export { Pionek };
