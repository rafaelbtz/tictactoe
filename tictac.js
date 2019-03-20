let waitingUser;
let board; //matriz com as jogadas onde 0: está livre, 1: jogador ou 2: computador

function config () {
    reset()
    render()
}

function motionCapture (row, column) {
    if (this.waitingUser){
        let cellValue = (this.board[row][column]);
        if (cellValue == 0)        {
            this.board[row][column] = 1;
            render()
        }
    }
}

function render () {
    let resderBoard = '<table cellspacing="0" cellpadding="0">'
    for (let row = 0; row < this.board.length; row++) {
        resderBoard += '<TR>'
        
        for (let col = 0; col < this.board[row].length; col++) {
            resderBoard += `<TD onClick="motionCapture(${row}, ${col})">${this.board[row][col]}</TD>`
        }

        resderBoard += '</TR>'
    }
    resderBoard += '</table>'

    $("#tableCanvas").html(resderBoard)
}


function reset () {
    this.waitingUser = true;
    this.board = [[0,0,0],
                  [0,0,0],
                  [0,0,0]];
}

config();