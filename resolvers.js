const neo4j = require('neo4j-driver');

// Create a Neo4j driver instance
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('your-username', 'your-password'));
const session = driver.session();

const resolvers = {
    Query: {
        getIngredient: (parent, { id }) => ingredients.find(ingredient => ingredient.id === id),
        getAllIngredients: () => ingredients,
    },
    Mutation: {
        createIngredient: (parent, { name }) => {
            const newIngredient = { id: String(ingredients.length + 1), name };
            ingredients.push(newIngredient);
            return newIngredient;
        },

        updateIngredient: (parent, { id, name }) => {
            const index = ingredients.findIndex(ingredient => ingredient.id === id);
            if (index !== -1) {
                ingredients[index].name = name;
                return ingredients[index];
            }
            return null; // Ingredient not found
        },
    },
    Subscription: {
        ingredientAdded: {
            subscribe: () => pubsub.asyncIterator(['INGREDIENT_ADDED']),
        },
    },
};

module.exports = resolvers;
