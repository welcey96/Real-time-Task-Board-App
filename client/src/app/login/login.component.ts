import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username?: string;

  constructor(private userService: UserService, private router: Router) {}

  login() {
    if (this.username?.trim()) {
      this.userService.setUsername(this.username);
      this.router.navigate(['/home']);
    }
  }
}
