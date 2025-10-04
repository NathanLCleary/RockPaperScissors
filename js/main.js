// Game state variables
let playerScore = 0;
let opponentScore = 0;
let opponent = 0;
let goal = 3;
let drawsCounter = 0;
let round = 1;
let gameActive = false;

// Persistent stats (don't reset)
let stats = {
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    totalRounds: 0,
    roundsWon: 0,
    totalDraws: 0
};

let roundHistory = [];
let currentMatch = 1;

// Utility function for element selection with error handling
const $ = (id) => {
    try {
        return document.getElementById(id);
    } catch (error) {
        console.error(`Error getting element with id '${id}':`, error);
        return null;
    }
};

// Show modal function (fixes missing btn() function)
const showModal = () => {
    $('modal').style.display = 'flex';
    $('Field').classList.add('hidden');
    resetGame();
};

// Trigger celebration animation
const triggerCelebration = () => {
    try {
        // Animate title
        const gameTitle = document.querySelector('.game-title');
        if (gameTitle) {
            gameTitle.classList.add('celebrate');
        }
        
        // Create confetti
        const overlay = $('celebrationOverlay');
        if (!overlay) return;
        
        overlay.classList.remove('hidden');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            overlay.appendChild(confetti);
        }
        
        // Clean up after animation
        setTimeout(() => {
            try {
                if (overlay) {
                    overlay.classList.add('hidden');
                    while (overlay.firstChild) {
                        overlay.removeChild(overlay.firstChild);
                    }
                }
                if (gameTitle) {
                    gameTitle.classList.remove('celebrate');
                }
            } catch (error) {
                console.error('Error cleaning up celebration:', error);
            }
        }, 4000);
    } catch (error) {
        console.error('Error triggering celebration:', error);
    }
};

// Hide modal and start game
const startgame = () => {
    try {
        const modal = $('modal');
        if (modal) {
            modal.style.display = 'none';
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.remove('winner');
            }
        }
        
        const goalAmountElement = $('goalAmount');
        goal = goalAmountElement ? parseInt(goalAmountElement.value) || 3 : 3;
        
        // Display goal with infinity symbol for unlimited
        const goalDisplay = goal === 99 ? '∞' : goal.toString();
        const goalElement = $('goal');
        const oGoalElement = $('oGoal');
        if (goalElement) goalElement.textContent = goalDisplay;
        if (oGoalElement) oGoalElement.textContent = goalDisplay;
        
        // Reset scores and counters
        playerScore = 0;
        opponentScore = 0;
        drawsCounter = 0;
        round = 1;
        
        const elements = {
            pScore: playerScore,
            oScore: opponentScore,
            draws: drawsCounter,
            round: round
        };
        
        Object.keys(elements).forEach(id => {
            const element = $(id);
            if (element) element.textContent = elements[id];
        });
        
        const winnerElement = $('winner');
        if (winnerElement) winnerElement.textContent = '';
        
        gameActive = true;
        enableButtons();
    } catch (error) {
        console.error('Error starting game:', error);
    }
};

// Handle player choice and game logic
const calculate = (option) => {
    try {
        if (!gameActive || !option || option < 1 || option > 3) return;
        
        disableButtons();
        showPlayerChoice(option);
        
        // Generate opponent choice
        opponent = Math.floor(Math.random() * 3) + 1;
        
        setTimeout(() => {
            try {
                showOpponentChoice(opponent);
                determineWinner(option, opponent);
                
                setTimeout(() => {
                    try {
                        if (checkGameEnd()) {
                            endGame();
                        } else {
                            const field = $('Field');
                            if (field) {
                                field.classList.remove('hidden');
                                field.classList.add('show');
                            }
                        }
                    } catch (error) {
                        console.error('Error in game end check:', error);
                    }
                }, 500);
            } catch (error) {
                console.error('Error in game calculation:', error);
            }
        }, 1000);
    } catch (error) {
        console.error('Error in calculate function:', error);
        enableButtons(); // Re-enable buttons on error
    }
};

// Show player's selected choice
const showPlayerChoice = (choice) => {
    try {
        if (!choice || choice < 1 || choice > 3) return;
        
        // Reset all choices
        document.querySelectorAll('.choice-btn').forEach(btn => {
            if (btn) btn.classList.remove('selected');
        });
        
        // Highlight selected choice
        const choices = ['rock', 'paper', 'scissors'];
        const selectedElement = $(choices[choice - 1]);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
    } catch (error) {
        console.error('Error showing player choice:', error);
    }
};

// Show opponent's choice
const showOpponentChoice = (choice) => {
    try {
        if (!choice || choice < 1 || choice > 3) return;
        
        // Hide waiting indicator
        const waiting = $('waiting');
        if (waiting) {
            waiting.style.display = 'none';
        }
        
        // Hide all opponent choices
        const opponentElements = ['oRock', 'oPaper', 'oScissors'];
        opponentElements.forEach(id => {
            const element = $(id);
            if (element) element.classList.add('hidden');
        });
        
        // Show opponent's choice
        const choices = ['oRock', 'oPaper', 'oScissors'];
        const selectedChoice = $(choices[choice - 1]);
        if (selectedChoice) {
            selectedChoice.classList.remove('hidden');
            selectedChoice.classList.add('fade-in');
        }
    } catch (error) {
        console.error('Error showing opponent choice:', error);
    }
};

// Determine round winner
const determineWinner = (playerChoice, opponentChoice) => {
    try {
        if (!playerChoice || !opponentChoice || playerChoice < 1 || playerChoice > 3 || opponentChoice < 1 || opponentChoice > 3) {
            console.error('Invalid choice parameters');
            return;
        }
        
        const resultElement = $('result');
        if (!resultElement) return;
        
        const choices = ['Rock', 'Paper', 'Scissors'];
        let roundResult;
        
        stats.totalRounds++;
        
        if (playerChoice === opponentChoice) {
            // Draw
            drawsCounter++;
            stats.totalDraws++;
            const drawsElement = $('draws');
            if (drawsElement) drawsElement.textContent = drawsCounter;
            resultElement.textContent = '🤝 It\'s a Draw!';
            resultElement.style.color = '#FFD700';
            roundResult = 'draw';
        } else if (
            (playerChoice === 1 && opponentChoice === 3) || // Rock beats Scissors
            (playerChoice === 2 && opponentChoice === 1) || // Paper beats Rock
            (playerChoice === 3 && opponentChoice === 2)    // Scissors beats Paper
        ) {
            // Player wins
            playerScore++;
            stats.roundsWon++;
            const pScoreElement = $('pScore');
            if (pScoreElement) pScoreElement.textContent = playerScore;
            resultElement.textContent = '🎉 You Win!';
            resultElement.style.color = '#4CAF50';
            roundResult = 'win';
        } else {
            // Opponent wins
            opponentScore++;
            const oScoreElement = $('oScore');
            if (oScoreElement) oScoreElement.textContent = opponentScore;
            resultElement.textContent = '😔 You Lose!';
            resultElement.style.color = '#f44336';
            roundResult = 'lose';
        }
        
        // Add to round history
        addRoundHistory(choices[playerChoice - 1], choices[opponentChoice - 1], roundResult);
        updateStats();
    } catch (error) {
        console.error('Error determining winner:', error);
    }
};

// Check if game should end
const checkGameEnd = () => {
    return (goal !== 99 && (playerScore >= goal || opponentScore >= goal));
};

// End game and show results
const endGame = () => {
    try {
        gameActive = false;
        const winnerElement = $('winner');
        if (!winnerElement) return;
        
        stats.totalGames++;
        
        if (playerScore > opponentScore) {
            stats.totalWins++;
            winnerElement.textContent = '🏆 Congratulations! You Won!';
            winnerElement.style.color = '#4CAF50';
            addGameHistory('win');
            triggerCelebration();
        } else if (playerScore < opponentScore) {
            stats.totalLosses++;
            winnerElement.textContent = '🤖 Bot Wins! Better luck next time!';
            winnerElement.style.color = '#f44336';
            addGameHistory('lose');
        } else {
            winnerElement.textContent = '🤝 It\'s a Tie Game!';
            winnerElement.style.color = '#FFD700';
            addGameHistory('tie');
        }
        
        updateStats();
        
        setTimeout(() => {
            try {
                showModal();
                if (playerScore > opponentScore) {
                    const modal = $('modal');
                    if (modal) {
                        const modalContent = modal.querySelector('.modal-content');
                        if (modalContent) {
                            modalContent.classList.add('winner');
                        }
                    }
                }
            } catch (error) {
                console.error('Error showing end game modal:', error);
            }
        }, 2000);
    } catch (error) {
        console.error('Error ending game:', error);
    }
};

// Reset round state
const reset = () => {
    try {
        // Hide result section
        const field = $('Field');
        if (field) {
            field.classList.remove('show');
            field.classList.add('hidden');
        }
        
        // Reset player choices
        document.querySelectorAll('.choice-btn').forEach(btn => {
            if (btn) btn.classList.remove('selected');
        });
        
        // Reset opponent display
        const opponentElements = ['oRock', 'oPaper', 'oScissors'];
        opponentElements.forEach(id => {
            const element = $(id);
            if (element) element.classList.add('hidden');
        });
        
        const waiting = $('waiting');
        if (waiting) {
            waiting.style.display = 'block';
        }
        
        // Increment round
        round++;
        const roundElement = $('round');
        if (roundElement) roundElement.textContent = round;
        
        // Re-enable buttons
        enableButtons();
    } catch (error) {
        console.error('Error resetting round:', error);
    }
};

// Enable/disable game buttons
const enableButtons = () => {
    try {
        document.querySelectorAll('.choice-btn').forEach(btn => {
            if (btn) btn.disabled = false;
        });
    } catch (error) {
        console.error('Error enabling buttons:', error);
    }
};

const disableButtons = () => {
    try {
        document.querySelectorAll('.choice-btn').forEach(btn => {
            if (btn) btn.disabled = true;
        });
    } catch (error) {
        console.error('Error disabling buttons:', error);
    }
};

// Reset entire game
const resetGame = () => {
    playerScore = 0;
    opponentScore = 0;
    drawsCounter = 0;
    round = 1;
    gameActive = false;
    
    $('pScore').innerHTML = playerScore;
    $('oScore').innerHTML = opponentScore;
    $('draws').innerHTML = drawsCounter;
    $('round').innerHTML = round;
    
    // Hide result section
    $('Field').classList.remove('show');
    $('Field').classList.add('hidden');
    
    // Reset player choices
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset opponent display
    $('oRock').classList.add('hidden');
    $('oPaper').classList.add('hidden');
    $('oScissors').classList.add('hidden');
    if ($('waiting')) {
        $('waiting').style.display = 'block';
    }
    
    enableButtons();
};

// Add round to history
const addRoundHistory = (playerChoice, opponentChoice, result) => {
    const entry = {
        round: round,
        playerChoice,
        opponentChoice,
        result,
        timestamp: new Date().toLocaleTimeString()
    };
    
    roundHistory.unshift(entry);
    if (roundHistory.length > 100) roundHistory.pop();
    
    updateRoundHistoryDisplay();
};

// Add game result to history
const addGameHistory = (result) => {
    const gameEntry = {
        type: 'game',
        result,
        score: `${playerScore}-${opponentScore}`,
        timestamp: new Date().toLocaleTimeString()
    };
    
    roundHistory.unshift(gameEntry);
    if (roundHistory.length > 100) roundHistory.pop();
    updateRoundHistoryDisplay();
};

// Update stats display
const updateStats = () => {
    try {
        const elements = {
            totalGames: stats.totalGames,
            totalWins: stats.totalWins,
            totalLosses: stats.totalLosses,
            totalRounds: stats.totalRounds,
            roundsWon: stats.roundsWon,
            totalDraws: stats.totalDraws
        };
        
        Object.keys(elements).forEach(id => {
            const element = $(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
        
        const winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;
        const winRateElement = $('winRate');
        if (winRateElement) {
            winRateElement.textContent = winRate + '%';
        }
        
        const roundWinRate = stats.totalRounds > 0 ? Math.round((stats.roundsWon / stats.totalRounds) * 100) : 0;
        const roundWinRateElement = $('roundWinRate');
        if (roundWinRateElement) {
            roundWinRateElement.textContent = roundWinRate + '%';
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
};

// Update match history display
const updateRoundHistoryDisplay = () => {
    try {
        const historyDiv = $('matchHistory');
        if (!historyDiv) return;
        
        // Clear existing content safely
        while (historyDiv.firstChild) {
            historyDiv.removeChild(historyDiv.firstChild);
        }
        
        roundHistory.forEach(entry => {
            if (!entry || typeof entry !== 'object') return;
            
            const div = document.createElement('div');
            
            if (entry.type === 'game') {
                div.className = `history-entry game-${entry.result || 'unknown'}`;
                const resultText = entry.result === 'win' ? 'WON' : entry.result === 'lose' ? 'LOST' : 'TIED';
                const resultIcon = entry.result === 'win' ? '🏆' : entry.result === 'lose' ? '😔' : '🤝';
                
                const header = document.createElement('div');
                header.className = 'entry-header';
                
                const matchSpan = document.createElement('span');
                matchSpan.textContent = `${resultIcon} Match ${stats.totalGames}`;
                
                const resultSpan = document.createElement('span');
                resultSpan.textContent = resultText;
                
                header.appendChild(matchSpan);
                header.appendChild(resultSpan);
                
                const details = document.createElement('div');
                details.className = 'entry-details';
                details.textContent = `Final Score: ${entry.score || 'N/A'}`;
                
                const time = document.createElement('div');
                time.className = 'entry-time';
                time.textContent = entry.timestamp || '';
                
                div.appendChild(header);
                div.appendChild(details);
                div.appendChild(time);
            } else {
                div.className = `history-entry ${entry.result || 'unknown'}`;
                const resultIcon = entry.result === 'win' ? '🎉' : entry.result === 'lose' ? '😔' : '🤝';
                const resultText = entry.result === 'win' ? 'Win' : entry.result === 'lose' ? 'Loss' : 'Draw';
                
                const header = document.createElement('div');
                header.className = 'entry-header';
                
                const roundSpan = document.createElement('span');
                roundSpan.textContent = `Match ${stats.totalGames}, Round ${entry.round || 'N/A'}`;
                
                const resultSpan = document.createElement('span');
                resultSpan.textContent = `${resultIcon} ${resultText}`;
                
                header.appendChild(roundSpan);
                header.appendChild(resultSpan);
                
                const details = document.createElement('div');
                details.className = 'entry-details';
                details.textContent = `${entry.playerChoice || 'Unknown'} vs ${entry.opponentChoice || 'Unknown'}`;
                
                const time = document.createElement('div');
                time.className = 'entry-time';
                time.textContent = entry.timestamp || '';
                
                div.appendChild(header);
                div.appendChild(details);
                div.appendChild(time);
            }
            
            historyDiv.appendChild(div);
        });
    } catch (error) {
        console.error('Error updating round history display:', error);
    }
};

// Initialize game on page load
window.addEventListener('load', () => {
    try {
        // Show modal on startup
        showModal();
        updateStats();
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            try {
                if (!gameActive || !e || !e.key) return;
                
                switch(e.key) {
                    case '1':
                    case 'r':
                    case 'R':
                        calculate(1);
                        break;
                    case '2':
                    case 'p':
                    case 'P':
                        calculate(2);
                        break;
                    case '3':
                    case 's':
                    case 'S':
                        calculate(3);
                        break;
                }
            } catch (error) {
                console.error('Error handling keyboard input:', error);
            }
        });
    } catch (error) {
        console.error('Error initializing game:', error);
    }
});

// Add click outside modal to close (optional)
window.addEventListener('click', (e) => {
    try {
        if (!e || !e.target) return;
        
        const modal = $('modal');
        if (modal && e.target === modal) {
            // Uncomment if you want click-outside-to-close functionality
            // modal.style.display = 'none';
        }
    } catch (error) {
        console.error('Error handling modal click:', error);
    }
});