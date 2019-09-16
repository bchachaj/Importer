const ingParser = require('ingredients-parser');

function buildResponseObject ({ ingredients, directions, name }) {
  // if possible, we further parse ingredients array into more granular structure
  const formatIngredients = [];
  const fractions = ['½', '⅓', '⅔', '¼', '¾', '⅕', '⅖', '⅗', '⅘', '⅙', '⅚', '⅐', '⅛', '⅜', '⅝', '⅞', '⅑', '⅒'];

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

  // handling case of units being fractions which 'ingredients-parser' struggles parsing
  formatIngredients.forEach((ing) => {
    const base = ing.name;
    if (!ing.quantity && fractions.indexOf(base[0]) !== -1) {
      const split = base.split('');
      ing.quantity = split.shift();
      const joined = split.join('');
      const reparse = ingParser.parse(joined);

      if (!ing.unit && reparse.unit) {
        ing.name = joined;
        ing.unit = reparse.unit;
        if (ing.name.includes(ing.unit)) {
          ing.name = ing.name.replace(ing.unit + ' ', '');
          ing.name = ing.name.trim();
        }
      }
    }
  });

  const responseObject = {
    name: name,
    ingredients: formatIngredients,
    steps: directions
  };
  return responseObject;
}

exports.buildResponseObject = buildResponseObject;
