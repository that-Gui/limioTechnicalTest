import React, { useState } from 'react';
import Board from '../Board';

/**
 * A game of tic-tac-toe.
 */
const Game = () => {
	const [playerX, setPlayerX] = useState('Player X');
	const [playerY, setPlayerY] = useState('Player Y');
	const [gameHistory, setGameHistory] = useState([
		{ squares: Array(9).fill(null) },
	]); // Start of game
	const [stepNumber, setStepNumber] = useState(0);
	const [xIsNext, setXisNext] = useState(true);
	const [leagueTable, setLeagueTable] = useState({});

	const calculateWinner = (squares) => {
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
			if (
				squares[a] &&
				squares[a] === squares[b] &&
				squares[a] === squares[c]
			) {
				return squares[a];
			}
		}

		return null;
	};

	const handleClick = (i) => {
		const history = gameHistory.slice(0, stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		squares[i] = xIsNext ? 'X' : 'O';

		const winner = calculateWinner(squares);
		if (winner) {
			const updatedLeagueTable = { ...leagueTable };
			updatedLeagueTable[winner] = updatedLeagueTable[winner]
				? updatedLeagueTable[winner] + 1
				: 1;
			setLeagueTable(updatedLeagueTable);
		}

		setGameHistory([...history, { squares }]);
		setStepNumber(history.length);
		setXisNext(!xIsNext);
	};

	const jumpTo = (step) => {
		setStepNumber(step);
		setXisNext(step % 2 === 0);
	};

	const current = gameHistory[stepNumber];
	const winner = calculateWinner(current.squares);

	const moves = gameHistory.map((step, move) => {
		const desc = move ? 'Go to move #' + move : 'Go to game start';
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{desc}</button>
			</li>
		);
	});

	let status;
	if (winner) {
		status = 'Winner: ' + winner;
	} else {
		status = 'Next player: ' + (xIsNext ? playerX : playerY);
	}

	const leagueTableRows = Object.entries(leagueTable).map(([player, wins]) => (
		<tr key={player}>
			<td>{player}</td>
			<td>{wins}</td>
		</tr>
	));

	return (
		<div className='game'>
			<div className='game-players'>
				<label>
					Player X:
					<input
						type='text'
						value={playerX}
						onChange={(e) => setPlayerX(e.target.value)}
					/>
				</label>
				<label>
					Player Y:
					<input
						type='text'
						value={playerY}
						onChange={(e) => setPlayerY(e.target.value)}
					/>
				</label>
			</div>
			<div className='game-board'>
				<Board
					squares={current.squares}
					onClick={(i) => handleClick(i)}
					winningMove={winner ? calculateWinningSquares(current.squares) : []}
				/>
			</div>
			<div className='game-info'>
				<div>{status}</div>
				<ol>{moves}</ol>
			</div>
			<div className='league-table'>
				<h2>League Table</h2>
				<table>
					<thead>
						<tr>
							<th>Player</th>
							<th>Wins</th>
						</tr>
					</thead>
					<tbody>{leagueTableRows}</tbody>
				</table>
			</div>
		</div>
	);
};

export default Game;
