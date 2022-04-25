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
        const geometryBox = new THREE.BoxGeometry(20, 5, 20);
        const material1 = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 10,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("imgs/white.jpg"),
        })

        const material2 = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("imgs/gray.jpg"),
        })

        this.szachownica.forEach(row => {
            let j = -70
            row.forEach(field => {
                let material
                if (field == 1) {
                    material = material1
                } else {
                    material = material2
                }
                const cube = new THREE.Mesh(geometryBox, material);
                cube.position.set(j, -5, i)
                this.scene.add(cube);
                j += 20
            });
            i += 20
        });


        const axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)

        this.render() // wywołanie metody render
    }

    setPawns(){
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
        const geometryCylinder = new THREE.CylinderGeometry(7, 7, 7, 32);
        const material3 = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("imgs/pink.jpg"),
        })
        const material4 = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("imgs/blue.jpg"),
        })

        pawns.forEach(row => {
            let j = -70
            row.forEach(pawn => {
                if (pawn != 0) {
                    let material
                    if (pawn == 1) {
                        material = material3
                    } else {
                        material = material4
                    }
                    const cylinder = new THREE.Mesh(geometryCylinder, material);
                    cylinder.position.set(j, 0, i)
                    this.scene.add(cylinder);
                }
                j += 20
            });
            i += 20
        });
    }

    setCamera1(){
        this.camera.position.set(0, 100, 180)
        this.camera.lookAt(this.scene.position)
    }

    setCamera2(){
        this.camera.position.set(0, 100, -180)
        this.camera.lookAt(this.scene.position)
    }

    

    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }
}

export {Game}