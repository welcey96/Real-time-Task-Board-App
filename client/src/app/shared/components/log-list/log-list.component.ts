import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { logs$ } from '@models/signals';
import { slideInAnimation } from '@shared/animations/animations';

@Component({
  selector: 'app-log-list',
  imports: [NgFor, NgIf, DatePipe],
  templateUrl: './log-list.component.html',
  styleUrl: './log-list.component.scss',
  animations: [slideInAnimation],
})
export class LogListComponent {
  get logs() {
    return logs$();
  }

  trackByIndex(index: number) {
    return index;
  }
}
