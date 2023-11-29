const neo4j = require('neo4j-driver');

// Create a Neo4j driver instance
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('your-username', 'your-password'));
const session = driver.session();

const resolvers = {
    Query: {
    },
    Mutation: {

    },
    Subscription: {
        ingredientAdded: {
        },
    },
};

module.exports = resolvers;
