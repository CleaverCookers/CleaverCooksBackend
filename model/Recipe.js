const {Ingredient} = require("./Ingredient");
const {Element} = require("./Element");

class Recipe {
    constructor(id, name, description, instructions, elements) {
        this.id = id
        this.name = name
        this.description = description
        this.instructions = instructions
        this.elements = elements
    }

    static async getOneById(driverSession, id) {
        const result = await driverSession.run('MATCH (n:Recipe) WHERE id(n) = $id OPTIONAL MATCH (n)-[r:Element]->(i:Ingredient) RETURN ID(n) AS id, n.name AS name, n.description AS description, n.instructions AS instructions, ID(i) AS ingredientId, i.name AS ingredientName, r.amount AS amount, ID(r) AS relationshipId', {id: parseInt(id)});
        return Recipe.convertRecordsToRecipes(result.records)[0];
    }

    static async getAll(driverSession) {
        const result = await driverSession.run('MATCH (n:Recipe) OPTIONAL MATCH (n)-[r:Element]->(i:Ingredient) RETURN ID(n) AS id, n.name AS name, n.description AS description, n.instructions AS instructions, ID(i) AS ingredientId, i.name AS ingredientName, r.amount AS amount, ID(r) AS relationshipId');
        return Recipe.convertRecordsToRecipes(result.records);
    }

    static async getAllByIngredientList(driverSession, ingredientList) {
        const result = await driverSession.run(`
                    MATCH (r:Recipe)-[:Element]->(i:Ingredient)
                    WITH r, count(i) AS ingredientCount
                    MATCH (r)-[:Element]->(i:Ingredient)
                    WHERE id(i) IN $ingredientIds
                    WITH r, ingredientCount, count(i) AS matchingIngredientCount
                    RETURN r, ingredientCount, matchingIngredientCount
                    ORDER BY matchingIngredientCount ASC, ingredientCount DESC
            `, {ingredientIds: ingredientList.map(id => parseInt(id))});

        //TODO : Use the same format as getAll
        return result.records.map(record => {
            const recipe = record.get('r').properties;
            recipe.id = record.get('r').identity.toString();
            recipe.ingredientCount = record.get('ingredientCount').toNumber();
            recipe.missingIngredientCount = recipe.ingredientCount - record.get('matchingIngredientCount').toNumber();
            return recipe;
        });
    }

    static async create(driverSession, name, description, instructions) {
        const result = await driverSession.run('CREATE (r:Recipe {name: $name, description: $description, instructions: $instructions}) RETURN r', {name, description, instructions});
        const singleRecord = result.records[0];
        const recipe = singleRecord.get(0);
        const recipeWithId = recipe.properties;
        recipeWithId.id = recipe.identity.toString();
        return recipeWithId;
    }

    static async update(driverSession, id, name, description, instructions) {
        const result = await driverSession.run('MATCH (r:Recipe) WHERE id(r) = $id SET r.name = $name, r.description = $description, r.instructions = $instructions RETURN r', {id: parseInt(id), name, description, instructions});
        const singleRecord = result.records[0];
        const recipe = singleRecord.get(0);
        const recipeWithId = recipe.properties;
        recipeWithId.id = recipe.identity.toString();
        return recipeWithId;
    }

    static async delete(driverSession, id) {
        await driverSession.run('MATCH (r:Recipe) WHERE id(r) = $id DETACH DELETE r', {id: parseInt(id)});
    }

    static async addIngredientToRecipe(driverSession, recipeId, element) {
        const result = await driverSession.run('MATCH (r:Recipe) WHERE id(r) = $recipeId MATCH (i:Ingredient) WHERE id(i) = $ingredientId CREATE (r)-[element:Element {amount: $amount}]->(i) RETURN r, element, i', {recipeId: parseInt(recipeId), ingredientId: parseInt(element.id), amount: element.amount});
        const singleRecord = result.records[0];
        const elementNode = singleRecord.get('element');
        const ingredientNode = singleRecord.get('i');
        const elementAdded = elementNode.properties;
        elementAdded.id = elementNode.identity.toString();
        elementAdded.ingredient = new Ingredient(ingredientNode.identity.toString(), ingredientNode.properties.name);
        return elementAdded;
    }

    static async removeIngredientFromRecipe(driverSession, elementId) {
        const result = await driverSession.run('MATCH (r:Recipe)-[element:Element]->(i:Ingredient) WHERE id(element) = $elementId DELETE element', {elementId: parseInt(elementId)});
        return true;
    }

    static async updateIngredientInRecipe(driverSession, element) {
        const result = await driverSession.run('MATCH (r:Recipe)-[element:Element]->(i:Ingredient) WHERE id(element) = $elementId SET element.amount = $amount RETURN r, element, i', {elementId: parseInt(element.id), amount: element.amount});
        const singleRecord = result.records[0];
        const elementNode = singleRecord.get('element');
        const ingredientNode = singleRecord.get('i');
        const elementUpdated = elementNode.properties;
        elementUpdated.id = elementNode.identity.toString();
        elementUpdated.ingredient = new Ingredient(ingredientNode.identity.toString(), ingredientNode.properties.name);
        return elementUpdated;
    }

    static convertRecordsToRecipes(records) {
        const recipeMap = new Map();
        records.forEach(record => {
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
    }
}

module.exports = {Recipe};

  