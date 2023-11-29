const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
   getAllIngredients: [Ingredient]
   getIngredient(id: ID!): Ingredient
  }
  
  type Mutation {
   createIngredient(name: String!): Ingredient
   updateIngredient(id: ID!, name: String!, quantity: Int!): Ingredient
    
  }
  
  type Subscription {
   ingredientAdded: Ingredient
  }


  type Ingredient {
   id: ID!
   name: String!
   quantity: Int!
  }
`;

module.exports = typeDefs;

