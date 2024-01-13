const {Ingredient} = require("./Ingredient");
const {Element} = require("./Element");

/**
 * A recipe is a series of instructions linked with ingredients (the link includes their quantity).
 */
class Recipe {
    constructor(id, name, description, instructions, image, elements) {
        this.id = id
        this.name = name
        this.description = description
        this.instructions = instructions
        this.image = image
        this.elements = elements
    }

    /**
     * Get a single recipe by its id.
     * @param driverSession
     * @param id
     * @returns {Promise<any>}
     */
    static async getOneById(driverSession, id) {
        const result = await driverSession.run('MATCH (n:Recipe) WHERE id(n) = $id OPTIONAL MATCH (n)-[r:Element]->(i:Ingredient) RETURN ID(n) AS id, n.name AS name, n.description AS description, n.instructions AS instructions, n.image as image, ID(i) AS ingredientId, i.name AS ingredientName, r.amount AS amount, r.unit AS unit, ID(r) AS relationshipId', {id: parseInt(id)});
        return Recipe.convertRecordsToRecipes(result.records)[0];
    }

    /**
     * Get all recipes.
     * @param driverSession
     * @returns {Promise<any[]>}
     */
    static async getAll(driverSession) {
        const result = await driverSession.run('MATCH (n:Recipe) OPTIONAL MATCH (n)-[r:Element]->(i:Ingredient) RETURN ID(n) AS id, n.name AS name, n.description AS description, n.instructions AS instructions, n.image as image, ID(i) AS ingredientId, i.name AS ingredientName, r.amount AS amount, r.unit AS unit, ID(r) AS relationshipId');
        return Recipe.convertRecordsToRecipes(result.records);
    }

    /**
     * Get all recipes that use all the ingredients in the ingredient list and sort them by the number of missing ingredients. (Less is better)
     * @param driverSession
     * @param ingredientList
     * @returns {Promise<(PropertyPreview[] | P | P | P)[]>}
     */
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

    /**
     * Create a new recipe.
     * @param driverSession
     * @param name
     * @param description
     * @param instructions
     * @param image
     * @returns {Promise<PropertyPreview[]|P|P|P>}
     */
    static async create(driverSession, name, description, instructions, image) {
        const result = await driverSession.run('CREATE (r:Recipe {name: $name, description: $description, instructions: $instructions, image: $image}) RETURN r', {name, description, instructions});
        const singleRecord = result.records[0];
        const recipe = singleRecord.get(0);
        const recipeWithId = recipe.properties;
        recipeWithId.id = recipe.identity.toString();
        return recipeWithId;
    }

    /**
     * Update a recipe.
     * @param driverSession
     * @param id
     * @param name
     * @param description
     * @param instructions
     * @param image
     * @returns {Promise<PropertyPreview[]|P|P|P>}
     */
    static async update(driverSession, id, name, description, instructions, image) {
        const result = await driverSession.run('MATCH (r:Recipe) WHERE id(r) = $id SET r.name = $name, r.description = $description, r.instructions = $instructions, r.image = $image RETURN r', {id: parseInt(id), name, description, instructions, image});
        const singleRecord = result.records[0];
        const recipe = singleRecord.get(0);
        const recipeWithId = recipe.properties;
        recipeWithId.id = recipe.identity.toString();
        return recipeWithId;
    }

    /**
     * Delete a recipe.
     * @param driverSession
     * @param id
     * @returns {Promise<void>}
     */
    static async delete(driverSession, id) {
        await driverSession.run('MATCH (r:Recipe) WHERE id(r) = $id DETACH DELETE r', {id: parseInt(id)});
    }

    /**
     * Add an ingredient to a recipe.
     * @param driverSession
     * @param recipeId
     * @param element
     * @returns {Promise<PropertyPreview[]|P|P|P>}
     */
    static async addIngredientToRecipe(driverSession, recipeId, element) {
        const result = await driverSession.run('MATCH (r:Recipe) WHERE id(r) = $recipeId MATCH (i:Ingredient) WHERE id(i) = $ingredientId CREATE (r)-[element:Element {amount: $amount, unit: $unit}]->(i) RETURN r, element, i', {recipeId: parseInt(recipeId), ingredientId: parseInt(element.id), amount: element.amount, unit: element.unit});
        const singleRecord = result.records[0];
        const elementNode = singleRecord.get('element');
        const ingredientNode = singleRecord.get('i');
        const elementAdded = elementNode.properties;
        elementAdded.id = elementNode.identity.toString();
        elementAdded.ingredient = new Ingredient(ingredientNode.identity.toString(), ingredientNode.properties.name);
        return elementAdded;
    }

    /**
     * Remove an ingredient from a recipe.
     * @param driverSession
     * @param elementId
     * @returns {Promise<boolean>}
     */
    static async removeIngredientFromRecipe(driverSession, elementId) {
        const result = await driverSession.run('MATCH (r:Recipe)-[element:Element]->(i:Ingredient) WHERE id(element) = $elementId DELETE element', {elementId: parseInt(elementId)});
        return true;
    }

    /**
     * Update an ingredient in a recipe.
     * @param driverSession
     * @param element
     * @returns {Promise<PropertyPreview[]|P|P|P>}
     */
    static async updateIngredientInRecipe(driverSession, element) {
        const result = await driverSession.run('MATCH (r:Recipe)-[element:Element]->(i:Ingredient) WHERE id(element) = $elementId SET element.amount = $amount, element.unit = $unit RETURN r, element, i', {elementId: parseInt(element.id), amount: element.amount, unit: element.unit});
        const singleRecord = result.records[0];
        const elementNode = singleRecord.get('element');
        const ingredientNode = singleRecord.get('i');
        const elementUpdated = elementNode.properties;
        elementUpdated.id = elementNode.identity.toString();
        elementUpdated.ingredient = new Ingredient(ingredientNode.identity.toString(), ingredientNode.properties.name);
        return elementUpdated;
    }

    /**
     * Convert a Neo4j records to a list of recipes with their elements + ingredients.
     * @param records
     * @returns {any[]}
     */
    static convertRecordsToRecipes(records) {
        const recipeMap = new Map();
        records.forEach(record => {
            const recipeId = record.get('id').toString();
            if (!recipeMap.has(recipeId)) {
                recipeMap.set(recipeId, new Recipe(recipeId,record.get('name'),record.get('description'),record.get('instructions'),record.get('image'), []));
            }
            const recipe = recipeMap.get(recipeId);
            const ingredientId = record.get('ingredientId');
            if (ingredientId !== null) {
                const ingredient = new Ingredient(ingredientId.toString(), record.get('ingredientName'));
                const element = new Element(record.get('relationshipId').toString(), record.get('amount'), record.get('unit'), ingredient);
                recipe.elements.push(element);
            }
        });
        return Array.from(recipeMap.values());
    }
}

module.exports = {Recipe};

  