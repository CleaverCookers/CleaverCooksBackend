/**
 * A recipe is a series of instructions linked with ingredients (the link includes their quantity).
 */
class Recipe {
    constructor(id, title, description, elements) {
      this.id = id
      this.title = title
      this.description = description
      this.elements = elements
    }
  }

  module.exports = { Recipe };

  