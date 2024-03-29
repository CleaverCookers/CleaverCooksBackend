const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const server = new ApolloServer({typeDefs, resolvers});
const app = express();

/**
 * Start the apollo server on the port defined using express.
 * @returns {Promise<void>}
 */
async function startServer() {
    await server.start();
    server.applyMiddleware({app});
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();
