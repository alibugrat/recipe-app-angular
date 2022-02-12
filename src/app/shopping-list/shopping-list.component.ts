import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from "../shared/ingredient.model";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {StartEdit} from "./store/shopping-list.actions";
import {AppState} from "../store/app.reducer";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  ngOnDestroy() {
  }

  onEdit(index: number) {
    this.store.dispatch(new StartEdit(index))
  }
}
