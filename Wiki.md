# Wiki: CleaverCooksBackend

## Table of Contents

- [CRUD Operations](#crud-operations)
  - [Purpose](#purpose)
  - [Schema Definition](#schema-definition)
  - [Resolvers](#resolvers)
  - [Usage Examples](#usage-examples)
- [Data Models](#data-models)

## Introduction

Welcome to the CleaverCooksBackend wiki! This resource offers detailed insights into the CRUD operations, data models, and querying capabilities of the CleaverCooksBackend GraphQL server.

### Purpose

The CleaverCooksBackend is designed to handle operations involving ingredients, recipes and their associations. The project is related to a frontend application on https://github.com/CleaverCookers/CleaverCooksApp that allows users to create ingredients and search for recipes based on the ingredients they have available. The server is built using Node.js as the runtime environment, Express.js as the web framework, Apollo Server as the GraphQL server and Neo4j as the database.

## CRUD Operations

### Schema Definition

Detailed descriptions of our GraphQL schema are as follows:

#### Query

- `getAllIngredients`: Fetches all available ingredients.
- `getIngredient(id: ID!)`: Retrieves a specific ingredient by ID.
- `getAllRecipes`: Retrieves all recipes in the database.
- `getRecipe(id: ID!)`: Fetches a specific recipe by ID.
- `getRecipesByIngredients(ingredientIds: [ID!]!)`: Retrieves recipes that contain specified ingredients.

#### Mutation

- `createIngredient(name: String!)`: Adds a new ingredient.
- `updateIngredient(id: ID!, name: String!)`: Modifies an existing ingredient.
- `deleteIngredient(id: ID!)`: Removes an ingredient.
- `createRecipe(...)`: Composes a new recipe.
- `updateRecipe(...)`: Updates recipe details.
- `deleteRecipe(id: ID!)`: Deletes a recipe.
- `addIngredientToRecipe(...)`: Associates an ingredient with a recipe.
- `removeIngredientFromRecipe(elementId: ID!)`: Disassociates an ingredient from a recipe.
- `updateIngredientInRecipe(...)`: Updates the details of an ingredient within a recipe.

#### Types and Input Types

- `Ingredient`: Represents an individual ingredient.
- `Element`: Links a recipe to an ingredient, specifying quantity.
- `Recipe`: Describes a recipe in detail.
- `RecipeInfos`: Provides updated information about a recipe.
- `ElementInput`: Input type for adding or updating recipe elements.

### Resolvers

Our GraphQL server employs a variety of resolvers to handle data retrieval and manipulation:

#### Query Resolvers

- `getAllIngredients`: Returns all ingredients.
- `getIngredient`: Retrieves a single ingredient.
- `getAllRecipes`: Fetches all recipes.
- `getRecipe`: Retrieves a specific recipe.
- `getRecipesByIngredients`: Retrieves recipes that contain specified ingredients.

#### Mutation Resolvers

- `createIngredient`: Adds a new ingredient.
- `updateIngredient`: Modifies an existing ingredient.
- `deleteIngredient`: Removes an ingredient.
- `createRecipe`: Composes a new recipe.
- `updateRecipe`: Updates an existing recipe.
- `deleteRecipe`: Deletes a recipe.
- `addIngredientToRecipe`: Adds an ingredient to a recipe.
- `removeIngredientFromRecipe`: Removes an ingredient from a recipe.
- `updateIngredientInRecipe`: Adjusts an ingredient's details in a recipe.

## Usage Examples

To interact with the CleaverCooksBackend GraphQL server, use a GraphQL client on http://localhost:3000/graphql. Here are examples of queries and mutations:

### Query Examples

#### Get All Ingredients
```graphql
query GetAllIngredients {
  getAllIngredients {
    id
    name
  }
}
```

#### Get a Specific Ingredient
```graphql
query GetIngredient {
  getIngredient(id: "1") {
    id
    name
  }
}
```

#### Get All Recipes
```graphql
query GetAllRecipes {
  getAllRecipes {
    id
    name
    description
    instructions
    image
    elements {
      id
      amount
      ingredient {
        id
        name
      }
    }
  }
}
```

#### Get a Specific Recipe
```graphql
query GetRecipe {
  getRecipe(id: "1") {
    id
    name
    description
    instructions
    image
    elements {
      id
      amount
      ingredient {
        id
        name
      }
    }
  }
}
```

### Mutation Examples

#### Create an Ingredient
```graphql
mutation CreateIngredient {
  createIngredient(name: "Tomato") {
    id
    name
  }
}
```

#### Update an Ingredient
```graphql
mutation UpdateIngredient {
  updateIngredient(id: "1", name: "Ripe Tomato") {
    id
    name
  }
}
```

#### Delete an Ingredient
```graphql
mutation DeleteIngredient {
  deleteIngredient(id: "1") {
    id
    name
  }
}
```

#### Create a Recipe
```graphql
mutation CreateRecipe {
  createRecipe(
    name: "Tomato Soup",
    description: "A delicious tomato soup",
    instructions: "Blend tomatoes and heat",
  ) {
    id
    name
    description
    instructions
    elements {
      id
      amount
      ingredient {
        id
        name
      }
    }
  }
}
```

#### Update a Recipe
```graphql
mutation UpdateRecipe {
  updateRecipe(
    id: "1",
    name: "Spicy Tomato Soup",
    description: "A delicious and spicy tomato soup",
    instructions: "Blend tomatoes, add spices and heat",
    image: "spicy-tomato-soup.jpg",
  ) {
    id
    name
    description
    instructions
    image
  }
}
```

#### Delete a Recipe
```graphql
mutation DeleteRecipe {
  deleteRecipe(id: "1")
}
```

#### Add an Ingredient to a Recipe
```graphql
mutation AddIngredientToRecipe {
  addIngredientToRecipe(
    recipeId: "1",
    element: {
      id: "2",
      amount: 1.5
    }
  ) {
    id
    amount
    ingredient {
      id
      name
    }
  }
}
```

#### Remove an Ingredient from a Recipe
```graphql
mutation RemoveIngredientFromRecipe {
  removeIngredientFromRecipe(elementId: "2")
}
```

#### Update an Ingredient in a Recipe
```graphql
mutation UpdateIngredientInRecipe {
  updateIngredientInRecipe(
    element: {
      id: "2",
      amount: 2.0
    }
  ) {
    id
    amount
    ingredient {
      id
      name
    }
  }
}
```

#### Get recipes by ingredients
```graphql
query GetRecipesByIngredients($ingredientIds: [ID!]!) {
  getRecipesByIngredients(ingredientIds: ["1", "2", "3"]) {
    id
    name
    ingredientCount
    missingIngredientCount
  }
}
```

## Data Models

### Element Model

Represents the link between a recipe and its ingredients, encapsulating the quantity used.

### Recipe Model

Describes the recipe's structure, including title, description, instructions, image, and the elements (ingredients and quantities).

### Ingredient Model

Represents an individual ingredient, encapsulating its name and ID.
