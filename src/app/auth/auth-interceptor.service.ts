import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {exhaustMap, map, take} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private store: Store<AppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
      return authState.user;
    }),
      exhaustMap(user => {
      if (!user){
        return next.handle(req)
      }else{
        const modifiedReq = req.clone({params: new HttpParams().set("auth", user.token)})
        return next.handle(modifiedReq)
      }
    }))
  }
}
