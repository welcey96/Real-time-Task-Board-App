import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { activeAccount$, users$ } from '@models/signals';
import { AuthService } from '@services/auth.service';
import { SocketService } from '@services/socket.service';

@Component({
  selector: 'app-top-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private socketService: SocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  getUser() {
    return users$().find((u) => u.id == this.socketService.getSocketId());
  }

  logout(popup?: boolean) {
    this.authService.logoutRedirect(popup);
  }
}
