import { Pionek } from "./Pionek.js"
import { Field } from "./Field.js"
import { ui } from "./Main.js";

class Game {

    constructor() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
        this.camera.position.set(0, 100, 180)
        this.camera.lookAt(this.scene.position)
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x0);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("root").append(this.renderer.domElement);


        this.light = new THREE.DirectionalLight(0xffffff, 1.2);
        this.light.position.set(1, 1, 1);
        this.scene.add(this.light);

        this.szachownica = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1]
        ];

        this.pawnsArray = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ];

        this.clickedPawn = null
        this.clickedField = null
        this.fieldsOptions = []

        this.deletingPawns = new Object()
        this.score = 0

        let i = -70
        this.szachownica.forEach(row => {
            let j = -70
            row.forEach(field => {
                let name = "f" + i + "_" + j
                if (field == 1) {
                    const field = new Field("imgs/white.jpg", j, -5, i, name)
                    this.scene.add(field)
                } else {
                    const field = new Field("imgs/gray.jpg", j, -5, i, name)
                    this.scene.add(field)
                }
                j += 20
            });
            i += 20
        });


        this.render() // wywołanie metody render

        this.sceneClickIsActive = true
        this.pawnName = null

    }

    setPawns() {
        let pawns = this.pawnsArray

        let i = -70
        pawns.forEach(row => {
            let j = -70
            row.forEach(pawn => {
                if (pawn != 0) {
                    if (pawn == 1) {
                        let name = "p" + i + "_" + j
                        const pio = new Pionek("imgs/pink.jpg", j, 0, i, name)
                        this.scene.add(pio)

                    } else {
                        let name = "p" + i + "_" + j
                        const pio = new Pionek("imgs/blue.jpg", j, 0, i, name)
                        this.scene.add(pio)
                    }
                }
                j += 20
            });
            i += 20
        });
    }

    setCamera1() {
        this.camera.position.set(0, 100, 180)
        this.camera.lookAt(this.scene.position)
    }

    setCamera2() {
        this.camera.position.set(0, 100, -180)
        this.camera.lookAt(this.scene.position)
    }

    enableSceneClick() {

        window.addEventListener("mousedown", (e) => {

            if (this.sceneClickIsActive) {

                const raycaster = new THREE.Raycaster();
                const mouseVector = new THREE.Vector2();

                mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouseVector, this.camera);

                const intersects = raycaster.intersectObjects(this.scene.children);

                if (intersects.length > 0) {

                    console.log(intersects[0].object.name);

                    if (intersects[0].object.constructor.name == "Pionek" && sessionStorage.getItem('side') == intersects[0].object.side) {

                        this.checkPositions(intersects[0])

                    }
                    else if (intersects[0].object.constructor.name == "Field" && this.fieldsOptions.includes(intersects[0].object.name)) {

                        if (this.clickedField != null) {
                            this.clickedField.deselected()
                        }

                        this.clickedField = intersects[0].object
                        this.clickedField.selected()

                        if (this.clickedPawn != null) {
                            console.log(this.clickedField.position);
                            this.clickedPawn.move(this.clickedField.position, this.pawnName)

                            this.clickedPawn.deselected()
                            this.clickedField.deselected()

                            this.clickedPawn = null
                            this.clickedField = null

                            ui.getTabInfo()
                        }
                    }



                }
            } else console.log("scene click not active");
        });

    }


    checkPositions(pawn) {

        console.log(this.pawnsArray);


        if (this.clickedPawn != null) {
            this.clickedPawn.deselected()

        }

        this.clickedPawn = pawn.object
        this.clickedPawn.selected()
        this.pawnName = pawn.object.name
        this.fieldsOptions = []

        var fields = this.scene.children.filter(function (e) {
            return e.constructor.name == "Field";
        });

        var opposidePawns = this.scene.children.filter(function (e) {
            return e.constructor.name == "Pionek" && e.side != sessionStorage.getItem('side');
        });
        console.log(opposidePawns)

        if (sessionStorage.getItem('side') == 'white') {

            this.basicMoveWhite()

        } if (sessionStorage.getItem('side') == 'black') {

            this.basicMoveBlack()

        }

    }

    basicMoveWhite() {
        try {
            let fName1 = 'f' + (this.clickedPawn.position.z - 20) + "_" + (this.clickedPawn.position.x - 20)
            let f1 = this.scene.getObjectByName(fName1, true);

            let idX = (f1.position.x + 70) / 20
            let idZ = (f1.position.z + 70) / 20
            if (this.pawnsArray[idZ][idX] == 0) {
                f1.material.color = { r: .8, g: .6, b: .8 }
                this.fieldsOptions.push(f1.name)
            }
            else if (this.pawnsArray[idZ][idX] == 2) {
                this.extraMove(idZ - 1, idX - 1, this.clickedPawn.position.z - 20, this.clickedPawn.position.x - 20)
            }

        } catch (err) {
            console.log(err);
        }


        try {
            let fName2 = 'f' + (this.clickedPawn.position.z - 20) + "_" + (this.clickedPawn.position.x + 20)
            let f2 = this.scene.getObjectByName(fName2, true);
            let idX = (f2.position.x + 70) / 20
            let idZ = (f2.position.z + 70) / 20
            if (this.pawnsArray[idZ][idX] == 0) {
                f2.material.color = { r: .8, g: .6, b: .8 }
                this.fieldsOptions.push(f2.name)
            }
            else if (this.pawnsArray[idZ][idX] == 2) {
                this.extraMove(idZ - 1, idX + 1, this.clickedPawn.position.z - 20, this.clickedPawn.position.x + 20)
            }
        } catch (err) {
            console.log(err);
        }
    }

    extraMove(idZ, idX, pawnZ, pawnX) {
        try {
            if (this.pawnsArray[idZ][idX] == 0) {
                let posX = idX * 20 - 70
                let posZ = idZ * 20 - 70
                let fName = 'f' + posZ + "_" + posX
                let f = this.scene.getObjectByName(fName, true);
                f.material.color = { r: .8, g: .6, b: .8 }
                this.fieldsOptions.push(f.name)
                let p = this.findPawn(pawnZ, pawnX)
                console.log(p, 'ppppp');

                this.deletingPawns[f.name] = p
            }
        } catch (err) {
            console.log(err);
        }

    }

    findPawn(posZ, posX){
        let foundPawn = 0

        var pawns = this.scene.children.filter(function (e) {
            return e.constructor.name == "Pionek";
        });

        pawns.forEach(p => {
            if(p.position.x == posX && p.position.z == posZ){
                console.log(p.name, "====p.name====");
                // p.material.color = { r: .1, g: .1, b: .8 }
                foundPawn = p.name
            }
        });
        
        return foundPawn
    }

    basicMoveBlack() {
        try {
            let fName1 = 'f' + (this.clickedPawn.position.z + 20) + "_" + (this.clickedPawn.position.x - 20)
            let f1 = this.scene.getObjectByName(fName1, true);

            let idX = (f1.position.x + 70) / 20
            let idZ = (f1.position.z + 70) / 20
            if (this.pawnsArray[idZ][idX] == 0) {
                f1.material.color = { r: .8, g: .6, b: .8 }
                this.fieldsOptions.push(f1.name)
            } else if (this.pawnsArray[idZ][idX] == 1) {
                this.extraMove(idZ + 1, idX - 1, this.clickedPawn.position.z + 20, this.clickedPawn.position.x - 20)
            }
        } catch (err) {
            console.log(err);
        }


        try {
            let fName2 = 'f' + (this.clickedPawn.position.z + 20) + "_" + (this.clickedPawn.position.x + 20)
            let f2 = this.scene.getObjectByName(fName2, true);
            let idX = (f2.position.x + 70) / 20
            let idZ = (f2.position.z + 70) / 20
            if (this.pawnsArray[idZ][idX] == 0) {
                f2.material.color = { r: .8, g: .6, b: .8 }
                this.fieldsOptions.push(f2.name)
            } else if (this.pawnsArray[idZ][idX] == 1) {
                this.extraMove(idZ + 1, idX + 1, this.clickedPawn.position.z + 20, this.clickedPawn.position.x + 20)
            }
        } catch (err) {
            console.log(err);
        }
    }




    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        TWEEN.update();

    }
}

export { Game }
