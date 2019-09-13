const ingParser = require('ingredients-parser');

function buildResponseObject ({ ingredients, directions, name }) {
  // if possible, we further parse ingredients array into more granular structure
  const formatIngredients = [];

  for (let i = 0; i < ingredients.length; i++) {
    const ing = ingredients[i];
    const parsedIng = ingParser.parse(ing);
    const ingObject = {
      name: parsedIng.ingredient,
      unit: parsedIng.unit,
      quantity: parsedIng.amount
    };
    formatIngredients.push(ingObject);
  }

  const responseObject = {
    name: name,
    ingredients: formatIngredients,
    steps: directions
  };
  return responseObject;
}

exports.buildResponseObject = buildResponseObject;
