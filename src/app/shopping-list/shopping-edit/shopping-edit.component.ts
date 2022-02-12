import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AddIngredient, DeleteIngredient, StopEdit, UpdateIngredient} from "../store/shopping-list.actions";
import {AppState} from "../../store/app.reducer";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm
  subscriptipn: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.subscriptipn = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscriptipn.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.store.dispatch(new UpdateIngredient(newIngredient))
    } else {
      this.store.dispatch(new AddIngredient(newIngredient))
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.store.dispatch(new StopEdit())
    this.slForm.reset();
  }

  onDelete() {
    this.store.dispatch(new DeleteIngredient())
    this.onClear();
  }

}
