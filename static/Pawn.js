class Pawn {
    constructor(color, size) {
        this._color = color
        this.size = size
        var material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('texture/white-pole.png'),
            color: color
        })
        var geometry = new THREE.CylinderGeometry(size * 0.35, size * 0.35, size * 0.3, 50);
        this.element = new THREE.Mesh(geometry, material);
    }

    set color(val) {
        this.element.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('texture/white-pole.png'),
            color: val
        })
        this._color = val
    }
    get color() {
        return this._color
    }

    getElement() {
        return this.element
    }

    clone() {
        return new Pawn(this.color, this.size)
    }

    setPosition(x, y, z) {
        this.element.position.set(x, y, z)
    }

    set x(x) {
        this.element.position.x = x
    }

    set y(y) {
        this.element.position.y = y
    }

    set z(z) {
        this.element.position.z = z
    }

    get x() {
        return this.element.position.x
    }
    get y() {
        return this.element.position.y
    }
    get z() {
        return this.element.position.z
    }

}