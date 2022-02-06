import {Injectable} from "@angular/core";
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe("Tasty Schnitzel", "A super testy Schnitzel - just awesome", "http://www.buseterim.com.tr/upload/default/2021/1/15/schnitzel680.jpg",
      [new Ingredient("Meat", 1), new Ingredient("French Fries", 20)]),
    new Recipe("Big Fat Burger", "What else you need to say?", "https://media-cdn.tripadvisor.com/media/photo-s/1b/9e/a5/ea/zapata-burger.jpg",
      [new Ingredient("Buns", 2), new Ingredient("Meat", 1)])
  ];

  constructor(private slService: ShoppingListService) {
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number){
    return this.recipes.slice()[id]
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
  this.slService.addIngredients(ingredients);
  }

}
