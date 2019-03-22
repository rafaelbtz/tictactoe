let waitingUser;
let boardMatrix; //matriz com as jogadas onde 0: está livre, 1: jogador ou 10: computador

const userValue = 1;
const computerValue = 10;

const userWinnerBase = userValue * 3;
const computerWinnerBase = computerValue * 3;

let endOfGame;
let winner; // User = 1, Computer = 10 or Draw = 0

let lastPlayerStarted = computerValue;

function config () {
    reset()
    render()
}

function motionCapture (row, column) {
    if (this.waitingUser && !this.endOfGame){
        let cellValue = (this.boardMatrix[row][column]);
        if (cellValue == 0)        {
            this.boardMatrix[row][column] = 1;
            endOfGameVerification();
            this.waitingUser = false;
            render();

            setTimeout(computerPlay, 200)
        }
    }
}

function endOfGameVerification () {
    let arrayOfResults = this.sumMatrixData();
    winnerVerification(arrayOfResults);
   
    drawVerification();
}

function sumMatrixData(){
    let resultArray = [];
    resultArray[0] = sumRow(0);
    resultArray[1] = sumRow(1);
    resultArray[2] = sumRow(2);

    resultArray[3] = sumColumn(0);
    resultArray[4] = sumColumn(1);
    resultArray[5] = sumColumn(2);

    resultArray[6] = this.boardMatrix[0][0] + this.boardMatrix[1][1] + this.boardMatrix[2][2];
    resultArray[7] = this.boardMatrix[2][0] + this.boardMatrix[1][1] + this.boardMatrix[0][2];

    return resultArray;
}

function sumRow(rowIndex){
    let total = 0;
    for(let col = 0; col < 3; col++){
        total += this.boardMatrix[rowIndex][col];
    }
    return total;
}

function sumColumn(columnIndex){
    let total = 0;
    for(let row = 0; row < 3; row++){
        total += this.boardMatrix[row][columnIndex];
    }
    return total;
}

function drawVerification(){
    if (this.endOfGame)return;

    let hasEmptyCell = false;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (this.boardMatrix[row][col] == 0) {
                hasEmptyCell = true;
                break;
            }
        }
        if(hasEmptyCell)break;
    }
    
    if(!hasEmptyCell){
        this.endOfGame = true;
        this.winner = 0;
    }
}

function winnerVerification(arrayOfResults){
    for(let i = 0; i < arrayOfResults.length; i++){
        let totalPoints = arrayOfResults[i];
        if(totalPoints == userWinnerBase || totalPoints == computerWinnerBase){
            this.endOfGame = true;
            this.winner = totalPoints == userWinnerBase ? 1 : 10;
            break;
        }
    }
}

function computerPlay () {
    if(this.endOfGame)return;

    let computerPlayed = false;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (this.boardMatrix[row][col] == 0) {
                this.boardMatrix[row][col] = 10;
                computerPlayed = true;
                break;
            }
        }
        if(computerPlayed)break;
    }

    // let arrayOfResults = this.sumMatrixData();
    // let computerPlayed = playToWinComputer(arrayOfResults);


    endOfGameVerification();
    this.waitingUser = true;
    this.render()
}

function playToWinComputer(arrayOfResults) {
    for (let i = 0; i < arrayOfResults.length; i++) {
        if (arrayOfResults[i] == 20) {
            this.playOn(i);
            break;
        }
    }
}

/**
 * @param {*} index 
 * 0,1,2 = linha 0,1,2
 * 3,4,5 = coluna 0,1,2
 * 6 = diagonal desc
 * 7 = diagonal asc
 */
function playOn(index) {

}

function render () {
    let renderBoard = '<table cellspacing="0" cellpadding="0">'
    for (let row = 0; row < this.boardMatrix.length; row++) {
        renderBoard += '<TR>'
        
        for (let col = 0; col < this.boardMatrix[row].length; col++) {
            renderBoard += `<TD onClick="motionCapture(${row}, ${col})">${this.boardMatrix[row][col]}</TD>`
        }

        renderBoard += '</TR>'
    }
    renderBoard += '</table>'

    $("#tableCanvas").html(renderBoard)

    $("#msg").html(this.waitingUser ? "Sua vez" : "Aguarde")

    if (this.endOfGame) {
        $("#msg").html(this.winner == 1 ? "Parabéns" : this.winner == 10 ? "Xiii você perdeu" : "Empate");
    }
}


function reset () {
    this.waitingUser = true;
    this.endOfGame = false;
    this.boardMatrix = 
                 [[0,0,0],
                  [0,0,0],
                  [0,0,0]];

    if (this.lastPlayerStarted == userValue) {
        this.lastPlayerStarted = computerValue;
        this.computerPlay()
    } else {
        this.lastPlayerStarted = userValue;
    }
}

config();