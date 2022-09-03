import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  symbol: any[] = [, 'X', 'O'];
  emptyArray: (size: number, fillValue: any) => any[] = (
    size: number,
    fillValue: any
  ): any[] => [...Array(size).fill(fillValue)];
  board: number[][] = this.emptyArray(3, this.emptyArray(3, 0));
  currentPlayer: number = 1;
  randomGIF!: string;
  thinking: boolean = false;
  message: string = '';

  constructor(private http: HttpClient) {}

  onTileClick(rowIndex: number, colIndex: number) {
    if (this.thinking || !this.isEmptyCell(rowIndex, colIndex)) return;
    this.board = this.updatedBoard(this.board, rowIndex, colIndex);
    if (this.winner === 1) {
      this.message = 'You Won!';
      return;
    } else if (this.winner === 2) {
      this.message = 'You Lost!';
      return;
    } else if (this.draw) {
      this.message = 'Draw!';
      return;
    }
    this.currentPlayer = this.changePlayer();
    if (this.currentPlayer === 2) {
      this.computerTurn();
    }
  }

  onRestart() {
    this.board = this.emptyBoard();
    this.currentPlayer = 1;
    this.message = '';
  }

  private get winner(): number {
    const horizontalWinner: any = this.board.find((row: number[]) =>
      row.every((col: number, i: number, arr: number[]) => col === arr[0])
    )?.[0];
    const verticalWinner: any = this.board[0].find((col: number, i: number) =>
      this.board.every((row: number[]) => row[i] === col)
    );
    const diagonalWinner: any =
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2]
        ? this.board[0][0]
        : null;
    const antiDiagonalWinner: any =
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0]
        ? this.board[0][2]
        : null;
    return (
      horizontalWinner || verticalWinner || diagonalWinner || antiDiagonalWinner
    );
  }

  private get draw(): boolean {
    return this.board.every((row: number[]) =>
      row.every((col: number) => col !== 0)
    );
  }

  private computerTurn() {
    this.thinking = true;
    this.randomGIF = '';
    this.getRandomGif().subscribe((url: string) => {
      this.randomGIF = url;
      setTimeout(() => {
        this.thinking = false;
        const emptyCells = this.board.reduce(
          (acc: number[][], row: number[], rowIndex: number) => {
            row.forEach((col: number, colIndex: number) => {
              if (col === 0) {
                acc.push([rowIndex, colIndex]);
              }
            });
            return acc;
          },
          []
        );
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const [rowIndex, colIndex] = emptyCells[randomIndex];
        this.board = this.updatedBoard(this.board, rowIndex, colIndex);
        if (this.winner === 2) {
          this.message = 'You Lost!';
          return;
        } else if (this.draw) {
          this.message = 'Draw!';
          return;
        }
        this.currentPlayer = this.changePlayer();
      }, 3000);
    });
  }

  private changePlayer() {
    return this.currentPlayer === 1 ? 2 : 1;
  }

  private isEmptyCell(rowI: number, colI: number) {
    return this.board[rowI][colI] === 0;
  }

  private updatedBoard(board: number[][], rowIndex: number, colIndex: number) {
    return board.map((row, rIndex) => {
      if (rowIndex === rIndex) {
        return row.map((col, cIndex) => {
          if (colIndex === cIndex) {
            return this.currentPlayer;
          }
          return col;
        });
      }
      return row;
    });
  }

  private emptyBoard() {
    return this.emptyArray(3, this.emptyArray(3, 0));
  }

  private getRandomGif(): Observable<string> {
    return this.http
      .get(
        'https://api.giphy.com/v1/gifs/random?api_key=5VWzikTONVTDeZD7saUk6gZfpXfzv6JL&tag=think&limit=6&rating=r',
        { responseType: 'json' }
      )
      .pipe(
        map((res: any) => res?.data?.id),
        filter((id) => !!id),
        map((id: string) => `https://i.giphy.com/media/${id}/giphy.webp`)
      );
  }
}
