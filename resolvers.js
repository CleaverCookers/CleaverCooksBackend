require('dotenv').config();
const neo4j = require('neo4j-driver');
const {Ingredient} = require('./model/Ingredient');
const {Element} = require('./model/Element');
const {Recipe} = require('./model/Recipe');

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
const session = driver.session();

const resolvers = {
    Query: {
        getIngredient: async (parent, {id}) => {
            try {
                const result = await session.run('MATCH (i:Ingredient) WHERE id(i) = $id RETURN i', {id: parseInt(id)});
                const singleRecord = result.records[0];
                const ingredient = singleRecord.get(0);
                const ingredientWithId = ingredient.properties;
                ingredientWithId.id = ingredient.identity.toString();
                return ingredientWithId;
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to get ingredient: ${error.message}`);
            }
        },
        getAllIngredients: async () => {
            try {
                const result = await session.run('MATCH (n:Ingredient) RETURN ID(n) AS id, n.name AS name');
                return result.records
                    .filter(record => record.get('name') !== null)
                    .map(record => ({
                        id: record.get('id').toString(),
                        name: record.get('name'),
                    }));
            } catch (error) {
                console.error(error);
                throw new Error('Failed to get ingredients');
            }
        },
        getRecipe: async (parent, {id}) => {
            try {
                const result = await session.run('MATCH (n:Recipe) WHERE id(n) = $id OPTIONAL MATCH (n)-[r:Element]->(i:Ingredient) RETURN ID(n) AS id, n.name AS name, n.description AS description, n.instructions AS instructions, ID(i) AS ingredientId, i.name AS ingredientName, r.amount AS amount, ID(r) AS relationshipId', {id: parseInt(id)});
                const recipeMap = new Map();
                result.records.forEach(record => {
                    const recipeId = record.get('id').toString();
                    if (!recipeMap.has(recipeId)) {
                        recipeMap.set(recipeId, new Recipe(recipeId,record.get('name'),record.get('description'),record.get('instructions'), []));
                    }
                    const recipe = recipeMap.get(recipeId);
                    const ingredientId = record.get('ingredientId');
                    if (ingredientId !== null) {
                        const ingredient = new Ingredient(ingredientId.toString(), record.get('ingredientName'));
                        const element = new Element(record.get('relationshipId').toString(), record.get('amount'), ingredient);
                        recipe.elements.push(element);
                    }
                });
                return Array.from(recipeMap.values())[0];
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to get recipe: ${error.message}`);
            }
        },
        getAllRecipes: async () => {
            try {
                const result = await session.run('MATCH (n:Recipe) OPTIONAL MATCH (n)-[r:Element]->(i:Ingredient) RETURN ID(n) AS id, n.name AS name, n.description AS description, n.instructions AS instructions, ID(i) AS ingredientId, i.name AS ingredientName, r.amount AS amount, ID(r) AS relationshipId');
                const recipeMap = new Map();
                result.records.forEach(record => {
                    const recipeId = record.get('id').toString();
                    if (!recipeMap.has(recipeId)) {
                        recipeMap.set(recipeId, new Recipe(recipeId,record.get('name'),record.get('description'),record.get('instructions'), []));
                    }
                    const recipe = recipeMap.get(recipeId);
                    const ingredientId = record.get('ingredientId');
                    if (ingredientId !== null) {
                        const ingredient = new Ingredient(ingredientId.toString(), record.get('ingredientName'));
                        const element = new Element(record.get('relationshipId').toString(), record.get('amount'), ingredient);
                        recipe.elements.push(element);
                    }
                });
                return Array.from(recipeMap.values());
            } catch (error) {
                console.error(error);
                throw new Error('Failed to get recipes');
            }
        },
        getRecipesByIngredients: async (parent, {ingredientIds}) => {
            try {
                const result = await session.run(`
                    MATCH (r:Recipe)
                    OPTIONAL MATCH (r)-[:Element]->(i:Ingredient)
                    WITH r, COUNT(i) AS ingredientCount, COLLECT(i.id) AS ingredientIds
                    WITH r, ingredientCount, ingredientIds, $ingredientIds AS inputIngredientIds
                    WITH r, ingredientCount, [id IN inputIngredientIds WHERE NOT id IN ingredientIds] AS missingIngredientIds
                    RETURN r, ingredientCount, SIZE(missingIngredientIds) AS missingIngredientCount
                    ORDER BY missingIngredientCount ASC
                `, {ingredientIds: ingredientIds.map(id => parseInt(id))});
        
                const recipes = result.records.map(record => {
                    const recipe = record.get('r').properties;
                    recipe.id = record.get('r').identity.toString();
                    recipe.ingredientCount = record.get('ingredientCount').toNumber();
                    recipe.missingIngredientCount = record.get('missingIngredientCount').toNumber();
                    return recipe;
                });
        
                return recipes;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to get recipes by ingredients');
            }
        },
    },
    Mutation: {
        createIngredient: async (parent, {name}) => {
            try {
                const result = await session.run('CREATE (i:Ingredient {name: $name}) RETURN i', {name});
                const createdIngredient = result.records[0].get('i').properties;

                createdIngredient.id = result.records[0].get('i').identity.toString();

                return createdIngredient;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to create ingredient');
            }
        },
        updateIngredient: async (parent, {id, name}) => {
            try {
                const result = await session.run('MATCH (i:Ingredient) WHERE id(i) = $id SET i.name = $name RETURN i', {
                    id: parseInt(id),
                    name
                });
                const updatedIngredient = result.records[0].get('i').properties;

                updatedIngredient.id = result.records[0].get('i').identity.toString();

                return updatedIngredient;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to update ingredient');
            }
        },
        deleteIngredient: async (parent, {id}) => {
            try {
                const result = await session.run('MATCH (i:Ingredient) WHERE id(i) = $id DETACH DELETE i RETURN i', {
                    id: parseInt(id),
                });

                if (result.records.length === 0) {
                    throw new Error(`Ingredient with ID ${id} not found`);
                }
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to delete ingredient: ${error.message}`);
            }
        },
        createRecipe: async (parent, parameters) => {
            const createRecipeQuery = `
                CREATE (recipe:Recipe {name: $name, description: $description, instructions: $instructions})
                RETURN recipe`;

            try {
                const result = await session.run(createRecipeQuery, parameters);

                if (!result.records || result.records.length === 0) {
                    console.error('Failed to create recipe');
                    throw new Error('Failed to create recipe');
                }

                const record = result.records[0];
                const recipeNode = record.get('recipe');
                const id = recipeNode.identity.toString();
                const createdRecipe = recipeNode.properties;
                createdRecipe.id = id;
                createdRecipe.elements = []

                return createdRecipe;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to create recipe');
            }
        },
        updateRecipe: async (parent, parameters) => {
            const updateRecipeQuery = `
                MATCH (recipe:Recipe) WHERE id(recipe) = $id
                SET recipe.name = $name, recipe.description = $description, recipe.instructions = $instructions
                RETURN recipe`;

            try {
                const result = await session.run(updateRecipeQuery, {
                    id: parseInt(parameters.id),
                    name: parameters.name,
                    description: parameters.description,
                    instructions: parameters.instructions,
                });

                if (!result.records || result.records.length === 0) {
                    console.error('Failed to update recipe');
                    throw new Error('Failed to update recipe');
                }

                const record = result.records[0];
                const recipeNode = record.get('recipe');
                const id = recipeNode.identity.toString();
                const updatedRecipe = recipeNode.properties;
                updatedRecipe.id = id;

                return updatedRecipe;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to update recipe');
            }
        },
        deleteRecipe: async (parent, {id}) => {
            const deleteRecipeQuery = `
                MATCH (recipe:Recipe) WHERE id(recipe) = $id
                DETACH DELETE recipe
                RETURN recipe`;

            try {
                const result = await session.run(deleteRecipeQuery, {
                    id: parseInt(id),
                });

                if (!result.records || result.records.length === 0) {
                    console.error('Failed to delete recipe');
                    throw new Error('Failed to delete recipe');
                }

                return true;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to delete recipe');
            }
        },
        addIngredientToRecipe: async (parent, {recipeId, element}) => {
            const addIngredientToRecipeQuery = `
                MATCH (recipe:Recipe) WHERE id(recipe) = $recipeId
                MATCH (ingredient:Ingredient) WHERE id(ingredient) = $ingredientId
                CREATE (recipe)-[element:Element {amount: $amount}]->(ingredient)
                RETURN recipe, element, ingredient`;

            try {
                const result = await session.run(addIngredientToRecipeQuery, {
                    recipeId: parseInt(recipeId),
                    ingredientId: parseInt(element.id),
                    amount: element.amount,
                });

                if (!result.records || result.records.length === 0) {
                    console.error('Failed to add ingredient to recipe');
                    throw new Error('Failed to add ingredient to recipe');
                }

                const elementNode = result.records[0].get('element');
                const ingredientNode = result.records[0].get('ingredient');
                const elementAdded = elementNode.properties;
                elementAdded.id = elementNode.identity.toString();
                elementAdded.ingredient = new Ingredient(ingredientNode.identity.toString(), ingredientNode.properties.name);

                return elementAdded;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to add ingredient to recipe');
            }
        },
        removeIngredientFromRecipe: async (parent, {elementId}) => {
            const removeIngredientFromRecipeQuery = `
                MATCH (recipe:Recipe)-[element:Element]->(ingredient:Ingredient)
                WHERE id(element) = $elementId
                DELETE element
                RETURN recipe`;

            try {
                const result = await session.run(removeIngredientFromRecipeQuery, {
                    elementId: parseInt(elementId),
                });

                if (!result.records || result.records.length === 0) {
                    console.error('Failed to remove ingredient from recipe');
                    throw new Error('Failed to remove ingredient from recipe');
                }

                return true;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to remove ingredient from recipe');
            }
        },
        updateIngredientInRecipe: async (parent, {element}) => {
            const updateIngredientInRecipeQuery = `
                MATCH (recipe:Recipe)-[element:Element]->(ingredient:Ingredient)
                WHERE id(element) = $elementId
                SET element.amount = $amount
                RETURN recipe, element, ingredient`;

            try {
                const result = await session.run(updateIngredientInRecipeQuery, {
                    elementId: parseInt(element.id),
                    amount: element.amount,
                });

                if (!result.records || result.records.length === 0) {
                    console.error('Failed to update ingredient in recipe');
                    throw new Error('Failed to update ingredient in recipe');
                }

                const elementNode = result.records[0].get('element');
                const ingredientNode = result.records[0].get('ingredient');
                const elementUpdated = elementNode.properties;
                elementUpdated.id = elementNode.identity.toString();
                elementUpdated.ingredient = new Ingredient(ingredientNode.identity.toString(), ingredientNode.properties.name);

                return elementUpdated;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to update ingredient in recipe');
            }
        }
    },
};

module.exports = resolvers;