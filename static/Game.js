import { Pionek } from "./Pionek.js"
import { Field } from "./Field.js"

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

        let i = -70
        this.szachownica.forEach(row => {
            let j = -70
            row.forEach(field => {
                let material
                if (field == 1) {
                    const field = new Field("imgs/white.jpg", j, -5, i)
                    this.scene.add(field)
                } else {
                    const field = new Field("imgs/gray.jpg", j, -5, i)
                    this.scene.add(field)
                }
                j += 20
            });
            i += 20
        });


        const axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)

        this.render() // wywołanie metody render


        // window.addEventListener("mousedown", (e) => {
        //     this.sceneClick(e)
        // });

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
                        const pio = new Pionek("imgs/pink.jpg", j, 0, i)
                        this.scene.add(pio)

                    } else {
                        const pio = new Pionek("imgs/blue.jpg", j, 0, i)
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

            console.log(e);

            const raycaster = new THREE.Raycaster(); // obiekt Raycastera symulujący "rzucanie" promieni
            const mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D

            mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouseVector, this.camera);

            const intersects = raycaster.intersectObjects(this.scene.children);

            if (intersects.length > 0) {

                // zerowy w tablicy czyli najbliższy kamery obiekt to ten, którego potrzebujemy:

                console.log(intersects[0].object);
                intersects[0].object.selected()

            }

        });

    }



    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }
}

export { Game }