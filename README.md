# CleaverCooksBackend

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js**: Download and install Node.js from the [Node.js Downloads](https://nodejs.org) page.
2. **Git**: Git is required for version control. Download and install it from [Git Downloads](https://git-scm.com).
3. **Neo4j Database**: CleaverCooksBackend uses Neo4j as its database. Download and set up Neo4j from [Neo4j Downloads](https://neo4j.com/download/).

## Getting Started

### Clone the Repository

Use the following commands to clone and navigate to the CleaverCooksBackend project:

```bash
git clone https://github.com/CleaverCookers/CleaverCooksBackend.git
cd CleaverCooksBackend
```

### Install Dependencies

Run the following command to install the project dependencies:

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the project root directory based on the `.env.example` file. Update it with your Neo4j database details:

```bash
NEO4J_URI=your_neo4j_uri
NEO4J_USERNAME=your_neo4j_username
NEO4J_PASSWORD=your_neo4j_password
```

## Development Workflow

### Branching Strategy

Adopt a consistent branching strategy:

```bash
git checkout -b feature/your-new-feature
```

### Code Changes and Commit

After making changes, commit them to your branch:

```bash
git add .
git commit -m "Describe your changes here"
```

### Push Changes and Pull Requests

Push your changes and create a pull request for review:

```bash
git push origin feature/your-new-feature
```

### Review and Merge

Once reviewed and approved, merge your changes into the `develop` branch.

## Running the Server Locally

To start the server locally:

```bash
npm start
```

Access the server at `http://localhost:3000/graphql`.

### Auto-restart with Nodemon

For auto-restarting the server during development:

```bash
npm install nodemon --save-dev
```

Update `package.json`:

```json
"scripts": {
  "start": "nodemon server.js"
}
```

Now, `npm start` will restart the server on file changes.
