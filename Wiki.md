# Wiki: CleaverCooksBackend

## Table of Contents

- [CRUD Operations](#crud-operations)
    - [Purpose](#purpose)
    - [Schema Definition](#schema-definition)
    - [Resolvers](#resolvers)
    - [Usage Examples](#usage-examples)
    - [Routes](#routes)

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

### Routes

The CRUD operations in CleaverCooksBackend are exposed through the `/api/ingredients` endpoint in the `routes/ingredients.js` file. Below is an overview of the available routes and how to test them using tools like Postman.

#### Endpoint

- **Base URL:** `http://localhost:3000`

- **Endpoint for CRUD Operations:** `/api/ingredients`

#### Operations

1. **Create Ingredient (POST):**
   - **Description:** Adds a new ingredient to the database.
   - **Endpoint:** `/api/ingredients`
   - **HTTP Method:** `POST`
   - **Request Body Example:**
     ```json
     {
       "name": "NewIngredient"
     }
     ```
   - **Response Example:**
     ```json
     {
       "id": 1,
       "name": "NewIngredient"
     }
     ```

2. **Get All Ingredients (GET):**
   - **Description:** Retrieves a list of all ingredients.
   - **Endpoint:** `/api/ingredients`
   - **HTTP Method:** `GET`
   - **Response Example:**
     ```json
     [
       {
         "id": 1,
         "name": "Ingredient1"
       },
       {
         "id": 2,
         "name": "Ingredient2"
       },
       // ... (other ingredients)
     ]
     ```

3. **Get Ingredient by ID (GET):**
   - **Description:** Retrieves a specific ingredient by its ID.
   - **Endpoint:** `/api/ingredients/:id`
   - **HTTP Method:** `GET`
   - **Response Example:**
     ```json
     {
       "id": 1,
       "name": "Ingredient1"
     }
     ```

4. **Update Ingredient by ID (PUT):**
   - **Description:** Updates the name of a specific ingredient by its ID.
   - **Endpoint:** `/api/ingredients/:id`
   - **HTTP Method:** `PUT`
   - **Request Body Example:**
     ```json
     {
       "name": "UpdatedIngredient"
     }
     ```
   - **Response Example:**
     ```json
     {
       "id": 1,
       "name": "UpdatedIngredient"
     }
     ```

5. **Delete Ingredient by ID (DELETE):**
   - **Description:** Deletes a specific ingredient by its ID.
   - **Endpoint:** `/api/ingredients/:id`
   - **HTTP Method:** `DELETE`
   - **Response Example:**
     ```json
     {
       "id": 1,
       "name": "UpdatedIngredient"
     }
     ```

#### Testing with Postman

1. Open Postman and set the request URL to `http://localhost:3000/api/ingredients`.

2. Use different HTTP methods (POST, GET, PUT, DELETE) for various operations.

3. Include request bodies for POST and PUT operations.

Feel free to update this section based on your project's specific requirements.```