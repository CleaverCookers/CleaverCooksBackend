# CleaverCooksBackend

## Prerequisites

1. **Node.js**: Make sure you have Node.js installed on your machine. You can download and install it from the official Node.js website: [Node.js Downloads](https://nodejs.org).

2. **Git**: Ensure that Git is installed on your machine. You can download and install it from the official Git website: [Git Downloads](https://git-scm.com).

3. **Neo4j Database**: Ensure you have a Neo4j database set up. You can download and install Neo4j from the official Neo4j website: [Neo4j Downloads](https://neo4j.com/download/).

4. **Neo4j Driver**: Install the Neo4j JavaScript driver.

   ```bash
   npm install neo4j-driver
## Getting Started

1. **Clone the Repository**: Open your terminal or command prompt and run the following commands to clone the project.

   ```bash
   git clone https://github.com/CleaverCookers/CleaverCooksBackend.git
   cd CleaverCooksBackend
   ```

2. **Install Dependencies**: Install the project dependencies using npm.

   ```bash
   npm install
   ```

## Development Workflow

1. **Branching Strategy**: Follow a branching strategy for development. Create a new branch for each feature or bug fix.

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Code Changes**: Make your code changes and commit them.

   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. **Push Changes**: Push your changes to the remote repository.

   ```bash
   git push origin feature/new-feature
   ```

4. **Pull Requests**: Create a pull request for your branch on the GitHub repository. Collaborate with team members and resolve any conflicts.

5. **Review and Merge**: Once the pull request is approved, merge it into the `develop` branch.

## Running the Server Locally

1. **Start the Server**: Run the following command to start the backend server locally.

   ```bash
   npm start
   ```

   The server will be accessible at `http://localhost:3000/graphql`.

2. **Testing Endpoints**: Use tools like [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/) or [Postman](https://www.postman.com) to test GraphQL endpoints.

## Additional Tips

- **Auto-restart during Development**: If you want the server to automatically restart on code changes during development, use `nodemon`.

   ```bash
   npm install nodemon --save-dev
   ```

  Update the `scripts` section in `package.json`:

   ```json
   "scripts": {
     "start": "nodemon server.js"
   }
   ```

  Now, run `npm start`, and the server will restart on file changes.
