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

  