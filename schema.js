const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getAllIngredients: [Ingredient]
    getIngredient(id: ID!): Ingredient
  }
  
  type Mutation {
    createIngredient(name: String!): Ingredient
    updateIngredient(id: ID!, name: String!): Ingredient
    deleteIngredient(id: ID!): Ingredient
  }
  
  type Subscription {
    ingredientAdded: Ingredient
  }

  type Ingredient {
    id: ID!
    name: String!
  }
`;

module.exports = typeDefs;