import { signal } from '@angular/core';
import { AccountInfo } from '@azure/msal-browser';
import { LogModel, UserModel } from '@models/models';

export const logs$ = signal<LogModel[]>([]);
export const users$ = signal<UserModel[]>([]);
export const activeAccount$ = signal<AccountInfo | null>(null);
