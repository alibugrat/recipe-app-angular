import {Component, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {map, switchMap} from "rxjs";
import {DeleteRecipe} from "../store/recipe.actions";
import {AddIngredients} from "../../shopping-list/store/shopping-list.actions";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.route.params.pipe(map(params => {
        this.id = +params['id'];
        return +params.id
      }),
      switchMap(() => {
        return this.store.select('recipe')
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        })
      })
    ).subscribe(recipe => {
      this.recipe = recipe;
    })
  }

  onAddToShoppingList() {
    this.store.dispatch(new AddIngredients(this.recipe.ingredients))
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  onDeleteRecipe() {
    this.store.dispatch(new DeleteRecipe(this.id));
    this.router.navigate(["/recipes"]);
  }

}
