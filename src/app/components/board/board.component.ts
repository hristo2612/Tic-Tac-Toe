import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Output() onPlayerWon: EventEmitter<'X'|'O'> = new EventEmitter();
  symbol: any[] = [, 'X', 'O'];
  emptyArray: (size: number, fillValue: any) => any[] = (
    size: number,
    fillValue: any
  ): any[] => [...Array(size).fill(fillValue)];
  board: number[][] = this.emptyArray(3, this.emptyArray(3, 0));
  currentPlayer: number = 1;
  // 5VWzikTONVTDeZD7saUk6gZfpXfzv6JL
  randomGIF!: string;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('https://api.giphy.com/v1/gifs/random?api_key=5VWzikTONVTDeZD7saUk6gZfpXfzv6JL&tag=think&limit=6&rating=r', { responseType: 'json' }).subscribe((res: any) => {
      console.log(res);
      this.randomGIF = `https://i.giphy.com/media/${res?.data?.id}/giphy.webp`;
    });
  }

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
