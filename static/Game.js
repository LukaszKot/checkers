class Game {
    constructor() {
        console.log("hello")
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,    // kąt patrzenia kamery (FOV - field of view)
            $(window).width() / $(window).height(),    // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maxymalna renderowana odległość od kamery 
        );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x222222);
        this.renderer.setSize($(window).width(), $(window).height());
        $("#root").append(this.renderer.domElement);
        this.tileSize = 100;
        this.camera.position.set(this.tileSize * 10, this.tileSize * 8, 0)
        this.camera.lookAt(this.scene.position);
        this.addAxes();
        this.render();
        this.addResizeListiner();
        this.addCheckboard();
    }

    addAxes() {
        var axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)
    }

    render = () => {
        requestAnimationFrame(this.render);

        this.renderer.render(this.scene, this.camera);
    }

    addResizeListiner() {
        $(window).on("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        })
    }

    addCheckboard() {
        this.checkboard = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
        ];
        var checkboardObject = this.getCheckboard();
        checkboardObject.position.set(-35 * this.tileSize / 10, 0, -35 * this.tileSize / 10)
        this.scene.add(checkboardObject)
    }

    getCheckboard() {
        var container = new THREE.Object3D();
        var blackPole = this.getBlackPole();
        var whitePole = this.getWhitePole();
        for (var i = 0; i < this.checkboard.length; i++) {
            for (var j = 0; j < this.checkboard[i].length; j++) {
                var pole;
                if (this.checkboard[i][j] == 0)
                    pole = whitePole.clone();
                else
                    pole = blackPole.clone();

                pole.position.x = i * this.tileSize;
                pole.position.z = j * this.tileSize;
                container.add(pole)
            }
        }
        return container;
    }

    getBlackPole() {
        var material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('texture/black-pole.png')
        })
        var geometry = new THREE.BoxGeometry(this.tileSize, this.tileSize * 0.3, this.tileSize);
        var cube = new THREE.Mesh(geometry, material);
        return cube;
    }

    getWhitePole() {
        var material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('texture/white-pole.png'),
        })
        var geometry = new THREE.BoxGeometry(this.tileSize, this.tileSize * 0.3, this.tileSize);
        var cube = new THREE.Mesh(geometry, material);
        return cube;
    }

    startAsPlayer(id) {
        this.id = id
        this.generatePawns();
        if (this.id == 1) {
            this.camera.position.x *= -1
            this.camera.lookAt(this.scene.position)
        }
    }

    generatePawns() {
        this.pawns = [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ]
        var pawns = this.getPawns();
        pawns.position.set(-35 * this.tileSize / 10, this.tileSize * 0.3, -35 * this.tileSize / 10)
        this.scene.add(pawns)
    }

    getPawns() {
        var blackPawn = new Pawn(0x111111, this.tileSize)
        var whitePawn = new Pawn(0xdddddd, this.tileSize)
        var container = new THREE.Object3D();

        for (var i = 0; i < this.pawns.length; i++) {
            for (var j = 0; j < this.pawns[i].length; j++) {

                if (this.pawns[i][j] != 0) {
                    var pawn;
                    if (this.pawns[i][j] == 1) {
                        pawn = whitePawn.clone();
                    }
                    else
                        pawn = blackPawn.clone();
                    pawn.x = i * this.tileSize;
                    pawn.z = j * this.tileSize;
                    container.add(pawn.getElement())
                }
            }
        }
        return container;
    }
}