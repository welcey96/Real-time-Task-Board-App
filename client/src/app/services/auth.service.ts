import { Inject, Injectable } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
  RedirectRequest,
} from '@azure/msal-browser';
import { filter, map, Observable, take, tap } from 'rxjs';
import { activeAccount$ } from '@models/signals';

//https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/redirects.md#redirects-with-standalone-components
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcast: MsalBroadcastService
  ) {
    this.listenToMsalEvents();
  }

  waitUntilReady(): Observable<boolean> {
    return this.msalBroadcast.inProgress$.pipe(
      filter((status) => status === InteractionStatus.None),
      take(1),
      tap(() => {
        // Set the active account Signal when MSAL is ready
        const account = this.getActiveAccount();
        if (account) activeAccount$.set(account);
      }),
      map(() => true)
    );
  }

  handleRedirectObservable() {
    return this.msalService.handleRedirectObservable();
  }

  private listenToMsalEvents() {
    this.msalBroadcast.msalSubject$
      .pipe(
        filter(
          (msg) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.ACCOUNT_ADDED
        )
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.msalService.instance.setActiveAccount(payload.account);
        activeAccount$.set(payload.account);
      });
  }

  getActiveAccount() {
    return this.msalService.instance.getActiveAccount();
  }

  isLoggedIn(): boolean {
    return !!this.getActiveAccount();
  }

  logoutRedirect(popup?: boolean) {
    if (popup) {
      this.msalService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else this.msalService.logoutRedirect();
  }

  loginRedirect() {
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }
}
