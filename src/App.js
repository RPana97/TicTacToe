import { useState } from 'react';

// Square component renders a single button representing a square on the board
function Square({ value, onSquareClick, isWinningSquare }) {
    // `value` is a prop that represents the current value of the square ('X', 'O', or null)
    // `onSquareClick` is a prop that handles the click event for the square
    // `isWinningSquare` is a prop that indicates if the square is part of the winning line
    return (
        <button className={`square ${isWinningSquare ? 'winning-square' : ''}`} onClick={onSquareClick}>  
            {value}
        </button>
    );
}

// Board component represents the entire game board
function Board({ xIsNext, squares, onPlay }) {
    // `xIsNext` is a prop that indicates if 'X' is the next player
    // `squares` is a prop that represents the current state of the board
    // `onPlay` is a prop that handles updating the state when a move is made

    // handleClick function handles a click event on a square
    function handleClick(i) {
        // If there's already a winner or the square is not empty, do nothing
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        // Create a copy of the squares array
        const nextSquares = squares.slice();

        // Set the square to 'X' or 'O' based on whose turn it is
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        // Call the onPlay function with the updated squares array
        onPlay(nextSquares);
    }

    // Check if there's a winner and get the winning line
    const winnerInfo = calculateWinner(squares);
    const winner = winnerInfo ? winnerInfo.winner : null;
    const winningSquares = winnerInfo ? winnerInfo.line : [];

    let status;
    // Set the status message to show the winner or the next player
    if (winner === 'Draw'){
        status = 'Draw';
    }
    else if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    // Render the board and the status message
    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinningSquare={winningSquares.includes(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinningSquare={winningSquares.includes(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinningSquare={winningSquares.includes(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinningSquare={winningSquares.includes(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinningSquare={winningSquares.includes(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinningSquare={winningSquares.includes(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinningSquare={winningSquares.includes(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinningSquare={winningSquares.includes(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinningSquare={winningSquares.includes(8)} />
            </div>
        </>
    );
}

// Game component manages the state of the entire game
export default function Game() {
    // State to keep track of the history of moves and the current move number
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    // Determine if 'X' should be the next player
    const xIsNext = currentMove % 2 === 0;
    // Get the current squares array based on the current move number
    const currentSquares = history[currentMove];

    // handlePlay function updates the game state when a move is made
    function handlePlay(nextSquares) {
        // Create a new history array up to the current move and add the new move
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        // Update the history and the current move number
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    // jumpTo function allows jumping to a specific move in the history
    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    // Map over the history to create a list of buttons for each move
    const moves = history.map((squares, move) => {
        let description;
        // Describe the move based on its index
        if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    function restartGame() {
        setHistory([Array(9).fill(null)]);
        setCurrentMove(0);
    }

    // Render the game board and the list of move buttons
    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
                <br></br>
                <button onClick = {restartGame}>Restart Game</button>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

// calculateWinner function checks if there's a winner in the game
function calculateWinner(squares) {
    // Possible winning combinations
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // If all three squares in a line are the same and not null, return the winner and the line
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    // Check if the board is full and no winning line found, return a draw
    if (squares.every((square) => square !== null)) {
        return { winner: 'Draw', line: [] };
    }
    // If no winner, return null
    return null;
}
