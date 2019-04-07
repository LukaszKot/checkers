class Ui {
    constructor(net, game) {
        this.status = $("#status")
        this.login = $("#login-button")
        this.reset = $("#reset-button")
        this.loginDiv = $("#login")
        this.usernameInput = $("#username-input")
        this.focus = $("#focus")
        this.waiting = $('#waiting')
        this.net = net;
        this.game = game;
        this.addClickListiners();
    }

    addClickListiners() {
        this.login.on("click", () => {
            this.net.login(this.usernameInput.val())
                .then(
                    result => {
                        if (result.status == "USER_ADDED") {
                            var color = result.position == "1" ? "białymi" : "czarnymi"
                            this.status.html(result.status + "<br />Witaj "
                                + this.usernameInput.val() + ", grasz " + color)
                            this.loginDiv.css("display", "none")
                            this.game.startAsPlayer(result.position)
                            if (result.position == 1) {
                                this.focus.css("display", "block")
                                this.waiting.css("display", "block")
                            }
                        }
                        if (result.status == "USER_WITH_THAT_NAME_ALREADY_EXISTS") {
                            this.status.html(result.status + "<br />"
                                + "Użytkownik o tej nazwie istnieje.")
                        }
                        if (result.status == "GAME_IS_FULL") {
                            this.status.html(result.status + "<br />"
                                + "Gra jest pełna.")
                        }
                    })
        })

        this.reset.on("click", () => {
            this.net.reset()
                .then(result => this.status.html(result.status
                    + "<br />Gra zresetowana"))
        })
    }
}