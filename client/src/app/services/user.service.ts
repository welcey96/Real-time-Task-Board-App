import { Injectable } from '@angular/core';
import { users$ } from '@models/signals';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private username = '';

  constructor() {}

  setUsername(name: string) {
    this.username = name;
  }

  getUsername(): string {
    return this.username;
  }
}
