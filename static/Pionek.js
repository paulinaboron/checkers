class Pionek extends THREE.Mesh {

    constructor(color, x, y, z) {
        super() // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.geometry = new THREE.CylinderGeometry(7, 7, 7, 32);

        this.material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 50,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load(color),
        })

        this.position.set(x, y, z)
    }

    selected() {
        this.material.color = { r: .8, g: .6, b: .8 }
    }



}
export { Pionek }
