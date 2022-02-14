import {Component, OnDestroy, OnInit} from '@angular/core';
import {map, Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import {Logout} from "../auth/store/auth.actions";
import {FetchRecipes, StoreRecipes} from "../recipes/store/recipe.actions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  fetchData() {
    this.store.dispatch(new FetchRecipes());
  }

  saveData() {
    this.store.dispatch(new StoreRecipes());
  }

  onLogOut() {
    this.store.dispatch(new Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
