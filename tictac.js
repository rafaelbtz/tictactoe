let waitingUser;
let boardMatrix; //matriz com as jogadas onde 0: está livre, 1: jogador ou 10: computador

const userValue = 1;
const computerValue = 10;

const userWinnerBase = userValue * 3;
const computerWinnerBase = computerValue * 3;

let endOfGame;
let winner; // User = 1, Computer = 10 or Draw = 0
let scoreArray;

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
            this.scoreArray[totalPoints == userWinnerBase ? 0 : 1] += 1;
            break;
        }
    }
}

function computerPlay () {
    if(this.endOfGame)return;
    let computerPlayed = playWhenSumIs(20); // play to win

    if (!computerPlayed) {
        computerPlayed = playWhenSumIs(2); // play to dont lost
    }

    if (!computerPlayed) {
        computerPlayed = playOnCorners();
    }

    if (!computerPlayed) {
        playOnEmptyCell();
    }

    endOfGameVerification();
    this.waitingUser = true;
    this.render()
}

function playWhenSumIs(value) {
    let arrayOfResults = this.sumMatrixData();
    for (let i = 0; i < arrayOfResults.length; i++) {
        if (arrayOfResults[i] == value) {
            this.playOn(i);
            return true;
        }
    }
}

function playOnCorners(arrayOfResults, value) {
    if (this.boardMatrix[0][0] == 0) {
        this.boardMatrix[0][0] = computerValue;
        return true;
    }
    if (this.boardMatrix[0][2] == 0) {
        this.boardMatrix[0][2] = computerValue;
        return true;
    }
    if (this.boardMatrix[2][0] == 0) {
        this.boardMatrix[2][0] = computerValue;
        return true;
    }
    if (this.boardMatrix[2][2] == 0) {
        this.boardMatrix[2][2] = computerValue;
        return true;
    }

    return false;
}

function playOnEmptyCell () {
    let computerPlayed = false;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (this.boardMatrix[row][col] == 0) {
                this.boardMatrix[row][col] = computerValue;
                computerPlayed = true;
                break;
            }
        }
        if(computerPlayed)break;
    }
}

/**
 * @param {*} index 
 * - 0,1,2 = row 0,1,2
 * - 3,4,5 = column 0,1,2
 * - 6 = diagonal desc
 * - 7 = diagonal asc
 */
function playOn(index) {
    if(index < 3){
        let emptyColumn = findEmptyColumnInRow(index);
        this.boardMatrix[index][emptyColumn] = computerValue;
    } else if (index < 6) {
        index = index - 3;
        let emptyRow = findEmptyRowInColumn(index);
        this.boardMatrix[emptyRow][index] = computerValue;
    } else if ( index == 6 || index == 7 ) {
        let emptyCellArray = findEmptyCellOnDiagonal(index == 6 ? 'desc' : 'asc');
        this.boardMatrix[emptyCellArray[0]][emptyCellArray[1]] = computerValue;
    }
}

function findEmptyColumnInRow(row) {
    for (let col = 0; col < 3; col++){
        if (this.boardMatrix[row][col] == 0)return col;
    }
}

function findEmptyRowInColumn(column) {
    for (let row = 0; row < 3; row++){
        if (this.boardMatrix[row][column] == 0)return row;
    }
}

function findEmptyCellOnDiagonal(ascOrDesc) {
    if(ascOrDesc == 'desc') {
        if (this.boardMatrix[0][0] == 0) return [0, 0];
        if (this.boardMatrix[1][1] == 0) return [1, 1];
        if (this.boardMatrix[2][2] == 0) return [2, 2];
    } else {
        if (this.boardMatrix[2][0] == 0) return [2, 0];
        if (this.boardMatrix[1][1] == 0) return [1, 1];
        if (this.boardMatrix[0][2] == 0) return [0, 2];
    }
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
    $("#score").html(`You ${this.scoreArray[0]} | Me ${this.scoreArray[1]}`)

    if (this.endOfGame) {
        $("#msg").html(this.winner == 1 ? "Parabéns" : this.winner == 10 ? "Xiii você perdeu" : "Empate");
        $("#btnNext").show()
    }
}

function next() {
    this.reset(true)
    if (this.lastPlayerStarted == userValue) {
        this.lastPlayerStarted = computerValue;
        this.computerPlay()
    } else {
        this.lastPlayerStarted = userValue;
    }
}

function reset (softReset) {
    this.waitingUser = true;
    this.endOfGame = false;
    this.boardMatrix = 
                 [[0,0,0],
                  [0,0,0],
                  [0,0,0]];
    if (!softReset){
        this.scoreArray = [0, 0]
        this.lastPlayerStarted = userValue;
    }
}

config();