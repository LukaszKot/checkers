class Net {
    constructor() {
    }

    login(username) {
        var body = {
            user: username,
            action: "ADD_USER"
        }
        return this.sendData("/login", "POST", body)
    }

    reset() {
        var body = {
            action: "RESET"
        }
        return this.sendData("/reset", "POST", body)
    }

    waitForPlayer() {
        return new Promise((resolve, reject) => {
            var body = {
                action: "PLAYER_PENDING"
            }
            return this.sendData("/players", "POST", body)
                .then((result) => {
                    if (result.length == 2) {
                        resolve(result)
                    }
                    else {
                        resolve(new Promise((res, rej) => {
                            setTimeout(() => {
                                this.waitForPlayer()
                                    .then((data) => {
                                        res(data)
                                    })
                            }, 500)
                        }))
                    }
                })
        })

    }

    sendData(url, method, body) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: url,
                data: body,
                type: method,
                success: function (data) {
                    resolve(data)
                },
                error: function (xhr, status, error) {
                    reject(JSON.parse(xhr.responseText))
                },
            });
        })

    }

}