import {Actions, Effect, ofType} from "@ngrx/effects";
import {FETCH_RECIPES, SetRecipes, STORE_RECIPES} from "./recipe.actions";
import {map, switchMap, withLatestFrom} from "rxjs";
import {Recipe} from "../recipe.model";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";

@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(FETCH_RECIPES),
    switchMap(() => {
        return this.http.get<Recipe[]>("https://recipe-book-d0c45-default-rtdb.europe-west1.firebasedatabase.app/recipes.json")
      }
    ),
    map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
      })
    }),
    map(recipes => {
      return new SetRecipes(recipes);
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(STORE_RECIPES),
    withLatestFrom(this.store.select('recipe')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put("https://recipe-book-d0c45-default-rtdb.europe-west1.firebasedatabase.app/recipes.json",
        recipesState.recipes
      )
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<AppState>) {
  }
}
