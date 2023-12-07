const express = require('express');
const router = express.Router();
const { Query, Mutation } = require('../resolvers');

// GraphQL route to create a new ingredient
router.post('/ingredients', async (req, res) => {
    try {
        const { name } = req.body;
        const newIngredient = await Mutation.createIngredient(null, { name });
        res.status(201).json(newIngredient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create ingredient' });
    }
});

// GraphQL route to get all ingredients
router.get('/ingredients', async (req, res) => {
    try {
        const ingredients = await Query.getAllIngredients();
        res.status(200).json(ingredients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve ingredients' });
    }
});

module.exports = router;
