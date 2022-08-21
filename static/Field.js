class Field extends THREE.Mesh {

    constructor(color, x, y, z, name) {
        super()
        this.name = name
        this.geometry = new THREE.BoxGeometry(20, 5, 20);

        this.material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 10,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load(color),
        })

        this.position.set(x, y, z)

        this.side = (color == "imgs/white.jpg") ? "white" : "black"
    }


    selected() {
        this.material.color = { r: .8, g: .6, b: .8 }
    }


    deselected(){
        this.material.color = { r: 1, g: 1, b: 1 }
    }



}
export { Field }