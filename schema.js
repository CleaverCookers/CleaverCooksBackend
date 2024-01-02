const {gql} = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getAllIngredients: [Ingredient]
    getIngredient(id: ID!): Ingredient
    getAllRecipes: [Recipe]
    getRecipe(id: ID!): Recipe
  }
  
  type Mutation {
    createIngredient(name: String!): Ingredient
    updateIngredient(id: ID!, name: String!): Ingredient
    deleteIngredient(id: ID!): Ingredient
    createRecipe(name: String!, description: String, instructions: String): Recipe
    updateRecipe(id: ID!, name: String!, description: String, instructions: String): RecipeInfos
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
    elements: [Element]!
  }
 
  type RecipeInfos {
    id: ID!
    name: String!
    description: String
    instructions: String
  }

  type Element {
    id: ID!
    amount: Float!
    ingredient: Ingredient!
  }

  type Ingredient {
    id: ID!
    name: String!
  }

  input ElementInput {
    id: ID!
    amount: Float!
  }
`;

module.exports = typeDefs;