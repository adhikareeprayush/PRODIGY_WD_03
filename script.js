/*
  Project Information:
  - Project Owner: Prayush Adhikari
  - Project Submission: This project has been submitted to Prodigy Info Tech.
  - Peoject Name: Tic Tac Toe App.
  - Role: Web Development Intern

  Copyright © 2023 Prayush Adhikari. All Rights Reserved.
  Unauthorized copying or reproduction of this file, in part or whole,
  without express permission from the copyright owner is prohibited.
*/
// Get DOM elements
var ai =  document.getElementById("ai");
var friend = document.getElementById("friend");

var qsn2 = document.getElementById("qsn2");
var qsn1 = document.getElementById("qsn1");

var restart = document.getElementById("restart");

// Event listener for restart button
if(restart){
    restart.addEventListener("click", function(){
        location.reload();
    });
}

var player1 = document.getElementById("player1");
var player2 = document.getElementById("player2");
var isAI=null, isPlayer1First=null;

// Event listeners for player and AI selection
ai.addEventListener("click", function(){
    qsn2.style.display = "block";
    isAI = 1;
    qsn1.style.display = "none";
});

friend.addEventListener("click", function(){
    qsn1.style.display = "none";
    document.getElementById("player1").innerHTML = "Friend";
    qsn2.style.display = "block";
    isAI = 0;
});

player1.addEventListener("click", function(){
    qsn2.style.display = "none";
    isPlayer1First = 1;
    enableClick();
    checkPlayers(isAI, isPlayer1First);
});

player2.addEventListener("click", function(){
    qsn2.style.display = "none";
    isPlayer1First = 0;
    enableClick();
    checkPlayers(isAI, isPlayer1First);
});

// Enable clicking on the game board
function enableClick(){
let box = document.getElementById("board");
box.style.pointerEvents = "auto";
}


// Game state variables
var board = ['','','','','','','','',''];
var gameState = "ongoing";  //status can be over, ongoing, draw
var currentPlayer = 'X';
var anotherPlayer = 'O';
var winner;

console.log(isAI);
console.log(isPlayer1First);


//check the players
function checkPlayers(isAI, isPlayer1First)
{
if(isAI == 1 && isPlayer1First == 1)
{
    currentPlayer = 'O';
    anotherPlayer = 'X';
    aiMove();
    console.log('AI vs Player AI Goes First');
}
else if(isAI == 1 && isPlayer1First == 0)
{
    console.log('AI vs Player Player Goes First');
}
else if(isAI == 0 && isPlayer1First == 1)
{
    console.log('Player vs Player Player 1 Goes First');
}
else if(isAI == 0 && isPlayer1First == 0)
{
    console.log('Player vs Player Player 2 Goes First');
}
}


//Display Winning Message
function displayWinMessage()
{
    document.getElementById('winning-message').style.display = "block";

    //check if the ai is playing or not
    if(isAI == 1 && gameState == "over")
    {
        if(winner == 'X')
        {
            document.getElementById('game-status').innerHTML = "Game Over!";
            document.getElementById('winner').innerHTML = "You Win!";

        }
        else
        {
            document.getElementById('game-status').innerHTML = "Game Over!";
            document.getElementById('winner').innerHTML = "You Lose!";
        }
    }
    else if(isAI == 0 && gameState == "over")
    {
        if(winner == 'X' && gameState == "over")
        {
            document.getElementById('game-status').innerHTML = "Game Over!";
            document.getElementById('winner').innerHTML = "Player 1 Wins!";
        }
        else
        {
            document.getElementById('game-status').innerHTML = "Game Over!";
            document.getElementById('winner').innerHTML = "Player 2 Wins!";
        }
    }
    else if(winner==null && gameState == "draw")
    {
        document.getElementById('game-status').innerHTML = "Game Over!";
        document.getElementById('winner').innerHTML = "Draw!";
    }
}


//Make Move Function Which Is called when a box is filled
function makeMove(pos)
{
    if(gameState == "ongoing")
    {
        if(board[pos] == '')
        {
            board[pos] = currentPlayer;
            console.log(board);
            if(currentPlayer == 'X')
            {
                document.getElementById(pos).innerHTML = 'X';
                document.getElementById(pos).classList.add('x');
                currentPlayer = 'O';
                anotherPlayer = 'X';
            }
            else
            {
                document.getElementById(pos).innerHTML = 'O';
                document.getElementById(pos).classList.add('o');
                currentPlayer = 'X';
                anotherPlayer = 'O';
            }
            checkStatus();
        }
    }
    if(isAI == 1 && currentPlayer == 'O')
    {
        aiMove();
    }
}

// Evaluate the Board
function evaluate(board) {
    if (checkWinner(board, currentPlayer)) {
        return 10; // Higher score for winning
    } else if (checkWinner(board, anotherPlayer)) {
        return -10; // Lower score for losing
    } else {
        // Heuristic: prioritize the center and corners
        var heuristicScore = 0;

        // Check rows, columns, and diagonals for potential wins or blocks
        for (var i = 0; i < 3; i++) {
            heuristicScore += evaluateLine(board[i * 3], board[i * 3 + 1], board[i * 3 + 2]); // Rows
            heuristicScore += evaluateLine(board[i], board[i + 3], board[i + 6]); // Columns
        }
        heuristicScore += evaluateLine(board[0], board[4], board[8]); // Main diagonal
        heuristicScore += evaluateLine(board[2], board[4], board[6]); // Anti-diagonal

        return heuristicScore;
    }
}

// Helper function to evaluate a line for potential wins or blocks
function evaluateLine(cell1, cell2, cell3) {
    var score = 0;
    
    // Check for potential wins or blocks
    if (cell1 === currentPlayer) {
        score = 1;
    } else if (cell1 === anotherPlayer) {
        score = -1;
    }

    if (cell2 === currentPlayer) {
        if (score === 1) {
            score = 10; // Two in a row for the current player
        } else if (score === -1) {
            return 0; // Opponent has a cell in this line, no potential win for the current player
        } else {
            score = 1; // One in a row for the current player
        }
    } else if (cell2 === anotherPlayer) {
        if (score === -1) {
            score = -10; // Two in a row for the opponent
        } else if (score === 1) {
            return 0; // Current player has a cell in this line, no potential win for the opponent
        } else {
            score = -1; // One in a row for the opponent
        }
    }

    if (cell3 === currentPlayer) {
        if (score > 0) {
            score *= 10; // Current player has two in a row, potential win
        } else if (score < 0) {
            return 0; // Opponent has a cell in this line, no potential win for the current player
        } else {
            score = 1; // One in a row for the current player
        }
    } else if (cell3 === anotherPlayer) {
        if (score < 0) {
            score *= 10; // Opponent has two in a row, potential block
        } else if (score > 0) {
            return 0; // Current player has a cell in this line, no potential win for the opponent
        } else {
            score = -1; // One in a row for the opponent
        }
    }

    return score;
}


// Check Winner
function checkWinner(board, player) {
    return (
        (board[0] === player && board[1] === player && board[2] === player) ||
        (board[3] === player && board[4] === player && board[5] === player) ||
        (board[6] === player && board[7] === player && board[8] === player) ||
        (board[0] === player && board[3] === player && board[6] === player) ||
        (board[1] === player && board[4] === player && board[7] === player) ||
        (board[2] === player && board[5] === player && board[8] === player) ||
        (board[0] === player && board[4] === player && board[8] === player) ||
        (board[2] === player && board[4] === player && board[6] === player)
    );
}

// Minimax Algorithm
function minimax(board, depth, alpha, beta, isMaximizing) {
    var score = evaluate(board);

    if (score !== 0 || depth === 0) {
        return score;
    }

    if (isMaximizing) {
        var bestScore = -Infinity;
        for (var i = 0; i < 9; i++) {
            if (board[i] == '') {
                board[i] = currentPlayer;
                var score = minimax(board, depth - 1, alpha, beta, !isMaximizing);
                board[i] = '';
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }
        }
        return bestScore;
    } else {
        var bestScore = Infinity;
        for (var i = 0; i < 9; i++) {
            if (board[i] == '') {
                board[i] = anotherPlayer;
                var score = minimax(board, depth - 1, alpha, beta, !isMaximizing);
                board[i] = '';
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }
        }
        return bestScore;
    }
}


// Make aiMove Function
function aiMove() {
    if (gameState === "ongoing") {
        var bestScore = -Infinity;
        var bestMoves = [];

        // Adjust the depth based on your game requirements
        var depth = 100;

        for (var i = 0; i < 9; i++) {
            if (board[i] == '') {
                board[i] = anotherPlayer;
                var score = minimax(board, depth, -Infinity, Infinity, false);
                board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMoves = [i];
                } else if (score === bestScore) {
                    bestMoves.push(i);
                }
            }
        }

        // Randomly choose one of the best moves
        var randomMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];

        makeMove(randomMove);
    }
}

// Check Status of the Game
function checkStatus()
{
    //check if the row is filled and equal
    for(var i=0; i<9; i+=3)
    {
        if(board[i] == board[i+1] && board[i+1] == board[i+2] && board[i] != '')
        {
            document.getElementById(i).classList.add('win');
            document.getElementById(i).classList.add('win-row');
            document.getElementById(i+1).classList.add('win');
            document.getElementById(i+1).classList.add('win-row');
            document.getElementById(i+2).classList.add('win');
            document.getElementById(i+2).classList.add('win-row');
            winner = board[i];
            gameState = "over";
            document.getElementById('restart').style.display = "block";
            displayWinMessage();
            break;
        }
    }
    
    //check if the column is filled and equal
    for(var i=0; i<3; i++)
    {
        if(board[i] == board[i+3] && board[i+3] == board[i+6] && board[i] != '')
        {
            gameState = "over";
            document.getElementById(i).classList.add('win');
            document.getElementById(i).classList.add('win-col');
            document.getElementById(i+3).classList.add('win');
            document.getElementById(i+3).classList.add('win-col');
            document.getElementById(i+6).classList.add('win');
            document.getElementById(i+6).classList.add('win-col');
            document.getElementById('restart').style.display = "block";
            winner=board[i];  
            displayWinMessage();   
            break;
        }
    }

    //check if the diagonal is filled and equal
    if(board[0] == board[4] && board[4] == board[8] && board[0] != '')
    {
        gameState = "over";
        document.getElementById(0).classList.add('win');
        document.getElementById(0).classList.add('win-diag');
        document.getElementById(4).classList.add('win');
        document.getElementById(4).classList.add('win-diag');
        document.getElementById(8).classList.add('win');
        document.getElementById(8).classList.add('win-diag');
        document.getElementById('restart').style.display = "block";
        winner=board[0];
        displayWinMessage();
    }

    if(board[2] == board[4] && board[4] == board[6] && board[2] != '')
    {
        gameState = "over";
        document.getElementById(2).classList.add('win');
        document.getElementById(2).classList.add('win-diag');
        document.getElementById(4).classList.add('win');
        document.getElementById(4).classList.add('win-diag');
        document.getElementById(6).classList.add('win');
        document.getElementById(6).classList.add('win-diag');
        document.getElementById('restart').style.display = "block";
        winner=board[2];
        displayWinMessage();
    }

    //check if the game is draw
    var filled = 0;
    for(var i=0; i<9; i++)
    {
        if(board[i] != '')
        {
            filled++;
        }
    }
    if(filled == 9 && gameState != "over")
    {
        gameState = "draw";
        winner=null;
        document.getElementById('restart').style.display = "block";
        displayWinMessage();
    }

    console.log(gameState);
}

