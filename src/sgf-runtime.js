const GoRule = require('./go-rule');

const SGFRuntime = function () {
    this.currentStep = 0;
    this.board = [];
    this.front = null;

    this.data = [];
    this.killBy = {};
    this.root = [];

    this.width = 0;
    this.height = 0;
}

SGFRuntime.prototype.setFront = function (front) {
    this.front = front;
}

SGFRuntime.prototype.hasFront = function () {
    return this.front != null;
}

SGFRuntime.prototype.init = function (w, h, data) {
    this.width = w;
    this.height = h;

    this.root = data;
    for (let i = 0; i < w; i++) {
        const line = [];
        for (let j = 0; j < h; j++) {
            line.push('');
        }
        this.board.push(line);
    }
}

SGFRuntime.prototype.boardPass = function (x, y, c) {
    return this.board[x][y] != c && this.board[x][y] !== '';
} 

SGFRuntime.prototype.kill = function (chesses) {
    this.killBy[this.currentStep + 1] = [];
    for (let j = 0; j < chesses.length; j++) {
        this.killBy[this.currentStep + 1].push({
            x: chesses[j].x,
            y: chesses[j].y,
            color: this.board[chesses[j].x][chesses[j].y]
        });
        this.board[chesses[j].x][chesses[j].y] = '';
        this.front && this.front.delete(chesses[j].x, chesses[j].y);
    }
}

SGFRuntime.prototype.backLife = function () {
    const dead = this.killBy[this.currentStep];
    if (dead) {
        dead.forEach(d => this.putChess(d));
        this.killBy[this.currentStep] = false;
    }
}

SGFRuntime.prototype.putChess = function (chess) {
    if (this.board[chess.x][chess.y] === '' 
            && !GoRule.isAsphyxiating(this, chess.x, chess.y, chess.color)) {
        this.currentStep++;
        if (chess.color == 'w') {
            this.front && this.front.putWhite(chess.x, chess.y);
            this.board[chess.x][chess.y] = 'w';
            this.front && this.front.select('b');
        } else {
            this.front && this.front.putBlack(chess.x, chess.y);
            this.board[chess.x][chess.y] = 'b';
            this.front && this.front.select('b');
        }
        this.data.push(chess);
    }
}

module.exports = SGFRuntime;
