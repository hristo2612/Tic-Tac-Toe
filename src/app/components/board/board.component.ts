import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { delay, filter, map, Observable, tap } from 'rxjs';
import { TileValue } from 'src/app/interfaces/tile';
import { environment } from 'src/environments/environment';
import { getEmptyArray } from 'src/app/util/array';
import { findWinner, getRandomTileIndex } from 'src/app/util/board';

export const Player: any = {
  X: 'X',
  O: 'O'
};

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  board: TileValue[] = getEmptyArray(9, null);
  currentPlayer: TileValue = Player.X;
  randomGIF!: string;
  isThinking!: boolean;
  message!: string;

  constructor(private http: HttpClient) {}

  onTileClick(index: number) {
    if (this.board[index] || this.message || this.isThinking || this.currentPlayer !== Player.X) return;
    this.board[index] = Player.X;
    this.currentPlayer = Player.O;
    const winner = findWinner(this.board);
    if (winner) {
      this.message = `${winner} won!`;
    } else if (this.board.every((tile) => !!tile)) {
      this.message = 'Draw!';
    } else {
      this.computerTurn().subscribe();
    }
  }

  restartGame(): void {
    this.board = getEmptyArray(9, null);
    this.currentPlayer = Player.X;
    this.message = '';
  }

  private computerTurn(): Observable<string> {
    return this.http.get(environment.gifUrl).pipe(
      map((res: any) => res?.data?.id),
      filter((id) => !!id),
      map((id: string) => `https://i.giphy.com/media/${id}/giphy.webp`),
      tap((url) => {
        this.randomGIF = url;
        this.isThinking = true;
      }),
      delay(2000),
      tap(() => {
        this.isThinking = false;
        this.board[getRandomTileIndex(this.board)] = Player.O;
        this.currentPlayer = Player.X;
      })
    );
  }
}
