# Wiki: CleaverCooksBackend

## Table of Contents

- [CRUD Operations](#crud-operations)
    - [Purpose](#purpose)
    - [Schema Definition](#schema-definition)
    - [Resolvers](#resolvers)
    - [Usage Examples](#usage-examples)

## Introduction

Welcome to the CleaverCooksBackend wiki! This wiki provides documentation in order to understand the CRUD operations in the CleaverCooksBackend GraphQL server.

## CRUD Operations

### Purpose

The CleaverCooksBackend GraphQL server supports CRUD operations for managing ingredients. This section explains the purpose, schema definition, resolvers, and provides usage examples for each operation.

### Schema Definition

#### Query

- `getAllIngredients`: Retrieves a list of all ingredients.
- `getIngredient(id: ID!)`: Retrieves a specific ingredient by its ID.

#### Mutation

- `createIngredient(name: String!)`: Creates a new ingredient with the given name.
- `updateIngredient(id: ID!, name: String!)`: Updates the name of a specific ingredient by its ID.
- `deleteIngredient(id: ID!)`: Deletes a specific ingredient by its ID.

#### Subscription

- `ingredientAdded`: Subscribes to notifications when a new ingredient is added.

### Resolvers

Explore the resolvers associated with each CRUD operation:

- `getIngredient`, `getAllIngredients`: Query resolvers.
- `createIngredient`, `updateIngredient`, `deleteIngredient`: Mutation resolvers.
- `ingredientAdded`: Subscription resolver.

### Usage Examples

To interact with the CRUD operations, use a GraphQL client or tool such as Apollo Client. Examples of queries and mutations:

```graphql
# Example Mutation: Create Ingredient
mutation {
  createIngredient(name: "NewIngredient") {
    id
    name
  }
}

# Example Query: Get All Ingredients
query {
  getAllIngredients {
    id
    name
  }
}

# Example Mutation: Update Ingredient
mutation {
  updateIngredient(id: "1", name: "UpdatedIngredient") {
    id
    name
  }
}

# Example Mutation: Delete Ingredient
mutation {
  deleteIngredient(id: "1") {
    id
    name
  }
}

# Example Subscription: Ingredient Added
subscription {
  ingredientAdded {
    id
    name
  }
}
```