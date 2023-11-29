const neo4j = require('neo4j-driver');

// Create a Neo4j driver instance
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('your-username', 'your-password'));
const session = driver.session();

const resolvers = {
    Query: {
        getAllIngredients: async () => {
            try {
                const result = await session.run('MATCH (i:Ingredient) RETURN i');
                return result.records.map(record => record.get('i').properties);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                throw new Error('Failed to fetch ingredients');
            }
        },
    },
    Mutation: {
        addIngredient: async (_, { name }) => {
            try {
                const result = await session.run('CREATE (i:Ingredient {name: $name, quantity: 0}) RETURN i', {
                    name,
                });
                const newIngredient = result.records[0].get('i').properties;

                pubsub.publish('INGREDIENT_ADDED', { ingredientAdded: newIngredient });

                return newIngredient;
            } catch (error) {
                console.error('Error adding ingredient:', error);
                throw new Error('Failed to add ingredient');
            }
        },
    },
    Subscription: {
        ingredientAdded: {
            subscribe: () => pubsub.asyncIterator(['INGREDIENT_ADDED']),
        },
    },
};

module.exports = resolvers;
