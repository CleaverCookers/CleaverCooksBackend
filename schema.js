const { gql } = require('apollo-server-express');

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
    createRecipe(name: String!, instructions: String!, ingredients: [ElementInput]!): Recipe
  }
  
  type Subscription {
    ingredientAdded: Ingredient
  }

  type Ingredient {
    id: ID!
    name: String!
  }

  type Element {
    id: ID!
    amount: Float!
    ingredient: Ingredient!
    relationshipId: ID!
}

  type Recipe {
    id: ID!
    name: String!
    instructions: String!
    elements: [Element]!
  }

  input ElementInput {
  id: ID!
  amount: Float!
}
`;

module.exports = typeDefs;