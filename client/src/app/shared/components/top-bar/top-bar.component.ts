import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { users$ } from '@models/signals';
import { SocketService } from '@services/socket.service';

@Component({
  selector: 'app-top-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopbarComponent {
  constructor(private socketService: SocketService) {}

  getUser() {
    return users$().find((u) => u.id == this.socketService.getSocketId());
  }
}
