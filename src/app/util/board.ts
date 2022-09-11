import { Player } from "../components/board/board.component";
import { TileValue } from "../interfaces/tile";

export const findWinner = (board: TileValue[]): 'You' | 'Computer' | null => {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winningCombos) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a] === Player.X ? 'You' : 'Computer';
    }
  }

  return null;
};

export const getRandomTileIndex = (board: TileValue[]): number => {
  const emptyTiles = board
    .map((tile, index) => ({ tile, index }))
    .filter(({ tile }) => !tile);

  return emptyTiles[Math.floor(Math.random() * emptyTiles.length)].index;
};
