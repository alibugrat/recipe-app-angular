import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {map, Subscription} from "rxjs";
import {AddRecipe, UpdateRecipe} from "../store/recipe.actions";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup
  ingredientsFormArray: FormArray

  private storeSub: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
      this.ingredientsFormArray = (<FormArray>this.recipeForm.get("ingredients"))
    })
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store.select('recipe').pipe(
        map(recipeState => {
            return recipeState.recipes.find((recipe, index) => index === this.id)
          }
        )
      ).subscribe(recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description

          if (recipe["ingredients"]) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(new FormGroup({
                "name": new FormControl(ingredient.name, Validators.required),
                "amount": new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)])
              }));
            }
          }
        }
      )
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    })
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(new UpdateRecipe({index: this.id, recipe: this.recipeForm.value}));
    } else {
      this.store.dispatch(new AddRecipe(this.recipeForm.value));
    }
    this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get("ingredients")).push(new FormGroup({
      "name": new FormControl(null, Validators.required),
      "amount": new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)])
    }));
  }

  onCancel() {
    this.router.navigate(["../"], {relativeTo: this.route});
  }

  onDeletingIngredient(index: number) {
    this.ingredientsFormArray.removeAt(index);
  }

  ngOnDestroy() {
    if (this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

}
