import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {AppState} from "./store/app.reducer";
import {Store} from "@ngrx/store";
import {AutoLogin} from "./auth/store/auth.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'recipe-app';

  constructor(private authService: AuthService, private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(new AutoLogin());
  }
}
