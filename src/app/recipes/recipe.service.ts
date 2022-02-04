import {EventEmitter, Injectable} from "@angular/core";
import {Recipe} from "./recipe.model";

@Injectable()
export class RecipeService {
  public recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe("A first test recipe", "this is simply test","https://images.wsj.net/im-121422"),
    new Recipe("A new recipe", "this is simply test 2","https://images.wsj.net/im-121422")
  ];

  getRecipes() {
    return this.recipes.slice();
  }

}
