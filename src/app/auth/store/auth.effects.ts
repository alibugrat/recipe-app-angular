import {Actions, Effect, ofType} from "@ngrx/effects";
import {HttpClient} from "@angular/common/http";
import {catchError, map, of, switchMap, tap} from "rxjs";

import {
  AUTHENTICATE_SUCCESS,
  AuthenticationSuccess,
  LOGIN_START,
  LoginStart,
  SIGNUP_START,
  AuthenticationFail, SignupStart, LOGOUT, AUTO_LOGIN
} from "./auth.actions";
import {environment} from "../../../environments/environment";
import {AuthService} from "../auth.service";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../user.model";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string
  registered?: string;
}

const handleAuthentication = (expiresIn: number, email: string, localId: string, idToken: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
  const user = new User(email, localId, idToken, expirationDate)
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthenticationSuccess({
    email: email,
    userId: localId,
    token: idToken,
    expirationDate: expirationDate,
    redirect: true
  });
}

const handleError = (errorRes: any) => {
  console.log(errorRes)
  let errorMessage = 'An unknown error occurred!'
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthenticationFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already.'
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not  exist.'
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.'
      break;
  }
  return of(new AuthenticationFail(errorMessage));
}

@Injectable()
export class AuthEffects {

  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(SIGNUP_START),
    switchMap((signupAction: SignupStart) => {
      return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseAPPIKey,
        {
          email: signupAction.payLoad.email,
          password: signupAction.payLoad.password,
          returnSecureToken: true
        }).pipe(
        tap((resData) => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }),
        map(resData => {
          return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      )
    }))

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(LOGIN_START),
    switchMap((authData: LoginStart) => {
      return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseAPPIKey,
        {
          email: authData.payLoad.email,
          password: authData.payLoad.password,
          returnSecureToken: true
        }).pipe(
        tap((resData) => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }),
        map(resData => {
          return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      )
    }),
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(ofType(AUTHENTICATE_SUCCESS), tap((authSuccessAction: AuthenticationSuccess) => {
    if (authSuccessAction.payload.redirect) {
      this.router.navigate(['/'])
    }
  }))

  @Effect({dispatch: false})
  autoLogout = this.actions$.pipe(ofType(LOGOUT), tap(() => {
    this.authService.clearLogoutTimer();
    localStorage.removeItem('userData');
    this.router.navigate(['/auth'])
  }))

  @Effect()
  autoLogin = this.actions$.pipe(ofType(AUTO_LOGIN), map(() => {
        const userData: {
          email: string,
          id: string,
          _token: string,
          _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'))
        if (!userData) {
          return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
          this.authService.setLogoutTimer(expirationDuration);
          return new AuthenticationSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          });
        }
        return {type: 'DUMMY'}
      }
    )
  );


  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {
  }
}
