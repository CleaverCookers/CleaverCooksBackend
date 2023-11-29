const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
   getAllIngredients: [Ingredient]
  }
  
  type Mutation {
   addIngredient(name: String!): Ingredient
    
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

