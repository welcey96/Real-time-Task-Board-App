import { signal } from '@angular/core';
import { LogModel, UserModel } from '@models/models';

export const logs$ = signal<LogModel[]>([]);
export const users$ = signal<UserModel[]>([]);
