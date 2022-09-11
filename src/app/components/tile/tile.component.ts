import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TileValue } from 'src/app/interfaces/tile';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TileComponent {
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Input() value!: TileValue;
}
