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

        this.clickedPawn = null
        this.clickedField = null
        this.fieldsOptions = []

        this.pawnToDelete = null
        this.deletingField = null

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
        let axes = new THREE.AxesHelper(100)
        this.scene.add(axes)

        this.sceneClickIsActive = true
        this.pawnName = null

    }

    setPawns() {
        let pawns = [
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ];

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

                console.log(e);

                const raycaster = new THREE.Raycaster();
                const mouseVector = new THREE.Vector2();

                mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
                mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouseVector, this.camera);

                const intersects = raycaster.intersectObjects(this.scene.children);

                if (intersects.length > 0) {

                    console.log(intersects[0].object.name);
                    console.log(intersects[0].object.constructor.name)

                    if (intersects[0].object.constructor.name == "Pionek" && sessionStorage.getItem('side') == intersects[0].object.side) {

                        if (this.clickedPawn != null) {
                            this.clickedPawn.deselected()

                        }

                        this.clickedPawn = intersects[0].object
                        this.clickedPawn.selected()
                        this.pawnName = intersects[0].object.name
                        this.fieldsOptions = []

                        var fields = this.scene.children.filter(function (e) {
                            return e.constructor.name == "Field";
                        });

                        var opposidePawns = this.scene.children.filter(function (e) {
                            return e.constructor.name == "Pionek" && e.side != sessionStorage.getItem('side');
                        });
                        console.log(opposidePawns)

                        fields.forEach(e => {
                            if (sessionStorage.getItem('side') == 'white') {

                                if (e.position.x == (this.clickedPawn.position.x + 20) || e.position.x == (this.clickedPawn.position.x - 20)) {

                                    if (e.position.z == (this.clickedPawn.position.z - 20)) {
                                        let idX = (e.position.x + 70) / 20
                                        let idZ = (e.position.z + 70) / 20
                                        if (this.szachownica[idZ][idX] == 0) {
                                            e.material.color = { r: .8, g: .6, b: .8 }
                                            this.fieldsOptions.push(e.name)
                                        }

                                    }

                                }


                            } else {
                                if (e.position.x == (this.clickedPawn.position.x + 20) || e.position.x == (this.clickedPawn.position.x - 20)) {

                                    if (e.position.z == (this.clickedPawn.position.z + 20)) {
                                        let idX = (e.position.x + 70) / 20
                                        let idZ = (e.position.z + 70) / 20
                                        if (this.szachownica[idZ][idX] == 0) {
                                            e.material.color = { r: .8, g: .6, b: .8 }
                                            this.fieldsOptions.push(e.name)
                                        }
                                    }

                                }
                            }
                        });

                        opposidePawns.forEach(e => {
                            if (sessionStorage.getItem('side') == 'white') {

                                if (e.position.x == (this.clickedPawn.position.x + 20)) {

                                    if (e.position.z == (this.clickedPawn.position.z - 20)) {
                                        fields.forEach(f => {

                                            if ((f.position.x == (this.clickedPawn.position.x + 40)) && f.position.z == (this.clickedPawn.position.z - 40)) {
                                                this.fieldsOptions.push(f.name)
                                                f.material.color = { r: .8, g: .6, b: .8 }
                                                this.deletingField = f
                                                this.pawnToDelete = e
                                                console.log(e.name);
                                                console.log(f.name);
                                                let p = this.clickedPawn
                                                this.fieldsOptions = this.fieldsOptions.filter(function (value) {
                                                    return value != 'f' + (p.position.x + 20) + '_' + (p.position.z - 20);
                                                });
                                            }
                                        });

                                    }

                                }

                                if (e.position.x == (this.clickedPawn.position.x - 20)) {

                                    if (e.position.z == (this.clickedPawn.position.z - 20)) {
                                        fields.forEach(f => {
                                            if (f.position.x == (this.clickedPawn.position.x - 40) && f.position.z == (this.clickedPawn.position.z - 40)) {
                                                this.fieldsOptions.push(f.name)
                                                f.material.color = { r: .8, g: .6, b: .8 }
                                                this.deletingField = f
                                                this.pawnToDelete = e
                                                console.log(e.name);
                                                console.log(f.name);

                                                let p = this.clickedPawn
                                                this.fieldsOptions = this.fieldsOptions.filter(function (value) {
                                                    return value != 'f' + (p.position.x - 20) + '_' + (p.position.z - 20);
                                                });
                                            }

                                        });

                                    }

                                }


                            } else {
                                if (e.position.x == (this.clickedPawn.position.x + 20) || e.position.x == (this.clickedPawn.position.x - 20)) {

                                    if (e.position.z == (this.clickedPawn.position.z + 20)) {
                                        fields.forEach(f => {
                                            if ((f.position.x == (this.clickedPawn.position.x + 40) || f.position.x == (this.clickedPawn.position.x - 40)) && f.position.z == (this.clickedPawn.position.z + 40)) {
                                                let idX = (e.position.x + 70) / 20
                                                let idZ = (e.position.z + 70) / 20
                                                if (this.szachownica[idZ][idX] == 0) {
                                                    e.material.color = { r: .8, g: .6, b: .8 }
                                                    this.fieldsOptions.push(e.name)
                                                }
                                            }
                                        });

                                    }

                                }
                            }
                        });


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