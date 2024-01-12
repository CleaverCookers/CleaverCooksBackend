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
                return await Ingredient.getOneById(session, id);
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to get ingredient: ${error.message}`);
            }
        },
        getAllIngredients: async () => {
            try {
                return await Ingredient.getAll(session);
            } catch (error) {
                console.error(error);
                throw new Error('Failed to get ingredients');
            }
        },
        getRecipe: async (parent, {id}) => {
            try {
                return await Recipe.getOneById(session, id);
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to get recipe: ${error.message}`);
            }
        },
        getAllRecipes: async () => {
            try {
                return await Recipe.getAll(session);
            } catch (error) {
                console.error(error);
                throw new Error('Failed to get recipes');
            }
        },
        getRecipesByIngredients: async (parent, {ingredientIds}) => {
            try {
                return await Recipe.getAllByIngredientList(session, ingredientIds);
            } catch (error) {
                console.error(error);
                throw new Error('Failed to get recipes by ingredients');
            }
        },
    },
    Mutation: {
        createIngredient: async (parent, {name}) => {
            try {
                return await Ingredient.create(session, name);
            } catch (error) {
                console.error(error);
                throw new Error('Failed to create ingredient');
            }
        },
        updateIngredient: async (parent, {id, name}) => {
            try {
                return await Ingredient.update(session, id, name);
            } catch (error) {
                console.error(error);
                throw new Error('Failed to update ingredient');
            }
        },
        deleteIngredient: async (parent, {id}) => {
            try {
                await Ingredient.delete(session, id);
                return true;
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to delete ingredient: ${error.message}`);
            }
        },
        createRecipe: async (parent, parameters) => {
            try {
                return await Recipe.create(session, parameters.name, parameters.description, parameters.instructions);
            } catch (error) {
                console.error(error);
                throw new Error('Failed to create recipe');
            }
        },
        updateRecipe: async (parent, parameters) => {
            try {
                return await Recipe.update(session, parameters.id, parameters.name, parameters.description, parameters.instructions);
            } catch (error) {
                console.error(error);
                throw new Error('Failed to update recipe');
            }
        },
        deleteRecipe: async (parent, {id}) => {
            try {
                await Recipe.delete(session, id);
                return true;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to delete recipe');
            }
        },
        addIngredientToRecipe: async (parent, {recipeId, element}) => {
            try {
                return await Recipe.addIngredientToRecipe(session, recipeId, element);
            } catch (error) {
                console.error(error);
                throw new Error('Failed to add ingredient to recipe');
            }
        },
        removeIngredientFromRecipe: async (parent, {elementId}) => {
            try {
                await Recipe.removeIngredientFromRecipe(session, elementId);
                return true;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to remove ingredient from recipe');
            }
        },
        updateIngredientInRecipe: async (parent, {element}) => {
            try {
                return await Recipe.updateIngredientInRecipe(session, element);
            } catch (error) {
                console.error(error);
                throw new Error('Failed to update ingredient in recipe');
            }
        }
    },
};

module.exports = resolvers;