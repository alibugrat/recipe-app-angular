import {Action} from "@ngrx/store";

export const LOGIN_START = 'LOGIN_START'
export const SIGNUP_START = 'SIGNUP_START'
export const LOGOUT = 'LOGOUT';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL'
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const AUTO_LOGIN = 'AUTO_LOGIN';

export class AuthenticationSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(public payload: { email: string, userId: string, token: string, expirationDate: Date , redirect: boolean}) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payLoad: { email: string, password: string }) {
  }
}

export class AuthenticationFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payLoad: string) {
  }
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payLoad: { email: string, password: string }) {
  }
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  AuthenticationSuccess
  | Logout
  | LoginStart
  | AuthenticationFail
  | SignupStart
  | ClearError
  | AutoLogin;
