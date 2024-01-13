const {gql} = require('apollo-server-express');

/**
 * The GraphQL schema in string form. It describes the type definitions for the API.
 * @type {DocumentNode}
 */
const typeDefs = gql`
  type Query {
    getAllIngredients: [Ingredient]
    getIngredient(id: ID!): Ingredient
    getAllRecipes: [Recipe]
    getRecipe(id: ID!): Recipe
    getRecipesByIngredients(ingredientIds: [ID!]!): [Recipe]
  }
  
  type Mutation {
    createIngredient(name: String!): Ingredient
    updateIngredient(id: ID!, name: String!): Ingredient
    deleteIngredient(id: ID!): Ingredient
    createRecipe(name: String!, description: String, instructions: String): Recipe
    updateRecipe(id: ID!, name: String!, description: String, instructions: String, image: String): RecipeInfos
    deleteRecipe(id: ID!): Boolean
    addIngredientToRecipe(recipeId: ID!, element: ElementInput!): Element
    removeIngredientFromRecipe(elementId: ID!): Boolean
    updateIngredientInRecipe(element: ElementInput!): Element
  }

  type Recipe {
    id: ID!
    name: String!
    description: String
    instructions: String
    image: String
    elements: [Element]!
    ingredientCount: Int
    missingIngredientCount: Int
  }
 
  type RecipeInfos {
    id: ID!
    name: String!
    description: String
    instructions: String
    image: String
  }

  type Element {
    id: ID!
    amount: Float!
    unit: String
    ingredient: Ingredient!
  }

  type Ingredient {
    id: ID!
    name: String!
  }

  input ElementInput {
    id: ID!
    amount: Float!
    unit: String
  }
`;

module.exports = typeDefs;