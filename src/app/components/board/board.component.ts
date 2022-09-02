import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  symbol: any[] = [, 'X', 'O'];
  emptyArray: (size: number, fillValue: any) => any[] = (
    size: number,
    fillValue: any
  ): any[] => [...Array(size).fill(fillValue)];
  board: number[][] = this.emptyArray(3, this.emptyArray(3, 0));
  currentPlayer: number = 1;

  constructor() {}

  ngOnInit(): void {}

  onTileClick(rowIndex: number, colIndex: number) {
    this.board = this.updatedBoard(this.board, rowIndex, colIndex);
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
}
