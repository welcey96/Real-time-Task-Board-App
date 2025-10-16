import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { activeUserInfo$, logs$, users$ } from '@models/signals';
import { SocketEmitEvent, SocketEvent } from '@enum/enum';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.socketUrl);

    for (const value of Object.values(SocketEvent)) {
      this.on(value);
    }
  }

  emit(event: SocketEmitEvent, data: any) {
    this.socket.emit(event, data);
  }

  on$(event: SocketEvent): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(event);
      };
    });
  }

  private on(event: SocketEvent) {
    this.socket.on(event, (data) => {
      switch (event) {
        case SocketEvent.UpdateLogs:
          logs$.set([...logs$(), data]);
          break;
        case SocketEvent.UpdateUserList:
          users$.set(data);
          break;
        case SocketEvent.UserJoinSuccess:
          activeUserInfo$.set(data);
          break;
      }
    });
  }

  getSocketId(): string {
    return this.socket.id ?? '0';
  }
}
