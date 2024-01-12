class Ingredient {
    constructor(id, name) {
        this.id = id
        this.name = name
    }

    static async getOneById(driverSession, id) {
        const result = await driverSession.run('MATCH (i:Ingredient) WHERE id(i) = $id RETURN i', {id: parseInt(id)});
        const singleRecord = result.records[0];
        const ingredient = singleRecord.get(0);
        const ingredientWithId = ingredient.properties;
        ingredientWithId.id = ingredient.identity.toString();
        return ingredientWithId;
    }

    static async getAll(driverSession) {
        const result = await driverSession.run('MATCH (n:Ingredient) RETURN ID(n) AS id, n.name AS name');
        return result.records
            .filter(record => record.get('name') !== null)
            .map(record => ({
                id: record.get('id').toString(),
                name: record.get('name'),
            }));
    }

    static async create(driverSession, name) {
        const result = await driverSession.run('CREATE (i:Ingredient {name: $name}) RETURN i', {name});
        const singleRecord = result.records[0];
        const ingredient = singleRecord.get(0);
        const ingredientWithId = ingredient.properties;
        ingredientWithId.id = ingredient.identity.toString();
        return ingredientWithId;
    }

    static async update(driverSession, id, name) {
        const result = await driverSession.run('MATCH (i:Ingredient) WHERE id(i) = $id SET i.name = $name RETURN i', {id: parseInt(id), name});
        const singleRecord = result.records[0];
        const ingredient = singleRecord.get(0);
        const ingredientWithId = ingredient.properties;
        ingredientWithId.id = ingredient.identity.toString();
        return ingredientWithId;
    }

    static async delete(driverSession, id) {
        await driverSession.run('MATCH (i:Ingredient) WHERE id(i) = $id DETACH DELETE i', {id: parseInt(id)});
    }
}

module.exports = {Ingredient};