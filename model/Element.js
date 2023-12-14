/**
 * An element is a link (part of the recipe) between a recipe and the ingredient that is used (specifications linked to the use of the ingredient in a specific recipe).
 */
export class Element {
    constructor(id, amount, ingredient) {
      this.id = id
      this.amount = amount
      this.ingredient = ingredient
    }
  }
  