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