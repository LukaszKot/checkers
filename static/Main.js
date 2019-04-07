var game, ui, net;
$(document).ready(function () {
    net = new Net();
    game = new Game(net);
    ui = new Ui(net, game);
})