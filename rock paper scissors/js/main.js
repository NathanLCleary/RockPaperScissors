//All variables used
var playerScore = 0;
var OpponentScore = 0;
var opponent = 0;
var goal = 3;
var drawsCounter = 0;

$ = function(id) {
    return document.getElementById(id);
}

/* modal */

// When the the goal has been reached end the game and open the modal 
gameover = function() {
    modal.style.visibility = "visible";
    $("Field").classList.add('w3-hide');
    reset();
    if (playerScore > OpponentScore) {
        $("winner").innerHTML = "Player wins!";
        $("winner").style.color = "green";
    } else if (playerScore < OpponentScore) {
        $("winner").innerHTML = "Bot wins!";
        $("winner").style.color = "red";
    } else {
        $("winner").innerHTML = "Draw!";
        $("winner").style.color = "Yellow";
    }
    $("draws").innerHTML = 0;
    $("round").innerHTML = 1;
}


// When the user clicks on start game, close the modal and start game
startgame = function() {
    modal.style.visibility = "hidden";
    goal = parseInt($("goalAmount").value);
    console.log(goal)
    if (goal == 99) {
        goal = "<i class='fas fa-infinity'></i>"
    }
    $("goal").innerHTML = goal;
    $("oGoal").innerHTML = goal;
    $("pScore").innerHTML = 0;
    $("oScore").innerHTML = 0;
}


//getting players option and setting the other inputs opacity to 0
playerInput = function(option) {
    if (option == 1) {
        $("paper").classList.add('w3-hide');
        $("scissors").classList.add('w3-hide');
        $("rock").width = 273;
        $("rockImg").width = 273;
    } else if (option == 2) {
        $("rock").classList.add('w3-hide');
        $("scissors").classList.add('w3-hide');
        $("paper").width = 273;
        $("paperImg").width = 273;
    } else if (option == 3) {
        $("paper").classList.add('w3-hide');
        $("rock").classList.add('w3-hide');
        $("scissors").width = 273;
        $("scissorsImg").width = 273;
    }
}

// making the opponent have its turn and locking in its answer
botTurn = function() {
    opponent = Math.floor(((Math.random()) * 3) + 1);
    console.log("op = " + opponent);
    if (opponent == 1) {
        $("oRock").classList.remove('w3-hide');
    } else if (opponent == 2) {
        $("oPaper").classList.remove('w3-hide');
    } else if (opponent == 3) {
        $("oScissors").classList.remove('w3-hide');
    }
}

//when the user chooses an option, checks what each player inputs and calculates who wins the round and if the game has been won
calculate = function(option) {
    playerScore = parseInt($("pScore").innerHTML);
    OpponentScore = parseInt($("oScore").innerHTML);
    playerInput(option);
    botTurn();

    //disables buttons until next round starts
    $("rock").disabled = true;
    $("paper").disabled = true;
    $("scissors").disabled = true;
    //calculating who won

    if (option == opponent) {
        drawsCounter++;
        $("draws").innerHTML = drawsCounter;
        $("result").innerHTML = "Draw!";
        $("result").style.color = "yellow";
    } else if (option == 1) {
        if (opponent == 3) {
            playerWin();
        } else {
            botWin();
        }
    } else if (option == 2) {
        if (opponent == 1) {
            playerWin();
        } else {
            botWin();
        }
    } else {
        if (opponent == 2) {
            playerWin();
        } else {
            botWin();
        }
    }
    $("Field").classList.remove('w3-hide');
    if (playerScore == goal) {
        gameover();
    }
    if (OpponentScore == goal) {
        gameover();
    }
}

//if the bot wins the round
botWin = function() {
    OpponentScore++;
    $("oScore").innerHTML = OpponentScore;
    $("result").innerHTML = "You lose!";
    $("result").style.color = "red";
    $("rock").disabled = false;
    $("paper").disabled = false;
    $("scissors").disabled = false;
}

//if player wins the round
playerWin = function() {
    playerScore++;
    $("pScore").innerHTML = playerScore;
    $("result").innerHTML = "You Win!";
    $("result").style.color = "green"
    $("rock").disabled = false;
    $("paper").disabled = false;
    $("scissors").disabled = false;
}

//if the game has been won reset everything to its intial state
reset = function() {
    $("paper").classList.remove('w3-hide');
    $("rock").classList.remove('w3-hide');
    $("scissors").classList.remove('w3-hide');
    $("paper").width = 130;
    $("rock").width = 130;
    $("scissors").width = 130;
    $("rockImg").width = 130;
    $("paperImg").width = 130;
    $("scissorsImg").width = 130;
    $("oRock").classList.add('w3-hide');
    $("oPaper").classList.add('w3-hide');
    $("oScissors").classList.add('w3-hide');
    $("Field").classList.add('w3-hide');
    round = parseInt($("round").innerHTML);
    round++;
    $("round").innerHTML = round;

}

//on window load get the variables
window.onload = function() {
    playerScore = parseInt($("pScore").innerHTML);
    OpponentScore = parseInt($("oScore").innerHTML);
}