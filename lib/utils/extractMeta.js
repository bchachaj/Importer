// utilies to parse available metadata

const attemptLDScrape = ($) => {
  // try to get JSON Linked Data if available on page (Schema.org)
  const findScriptSchema = $('script[type="application/ld+json"]');

  const extractedData = {
    ingredients: [],
    directions: []
  };
  if (findScriptSchema.length) {
    let scriptString = findScriptSchema.html().trim();

    // replace char(160) which breaks JSON parse
    scriptString = scriptString.replace(/\s+/g, ' ');
    const recipeSchemaObject = JSON.parse(scriptString);

    if (recipeSchemaObject.recipeIngredient) {
      extractedData.ingredients = recipeSchemaObject.recipeIngredient;
    }
    // split into sentences for now
    if (recipeSchemaObject.recipeInstructions) {
      extractedData.directions = recipeSchemaObject.recipeInstructions.split('. ');
    }

    if (extractedData.ingredients.length && extractedData.directions.length) {
      return extractedData;
    }
  }

  return -1;
};

// search DOM for node types that co-incide with Schema structure
const attemptExtractByProps = ($) => {
  const extractedData = {
    ingredients: [],
    directions: []
  };
  let directions = [];

  // schema for ingredients can have two forms, will prefer 'ingredients' over 'recipeIngredients'
  const findIngredients = $("*[itemprop = 'ingredients']");
  const findRecipeIngredients = $("*[itemprop = 'recipeIngredient']");
  const findInstructions = $("*[itemprop = 'recipeInstructions']");

  if (findIngredients.length) {
    for (let i = 0; i < findIngredients.length; i++) {
      const ing = findIngredients[i];
      extractedData.ingredients.push($(ing).text());
    }
  }

  if (!findIngredients.length && findRecipeIngredients.length) {
    for (let i = 0; i < findRecipeIngredients.length; i++) {
      const ing = findRecipeIngredients[i];
      let node = $(ing).text();
      node = node.split('\n').map((e) => e.trim()).filter((e) => e.length).join(' ');
      extractedData.ingredients.push(node);
    }
  }

  if (findInstructions.length) {
    for (let i = 0; i < findInstructions.length; i++) {
      const direction = findInstructions[i];
      // let node = $(direction).text();
      const text = $(direction).text();
      const filtered = text.split('\n').map((e) => e.trim()).filter((e) => e.length).join(' ');
      directions.push(filtered);
    }
    // format if single string
    if (directions.length === 1) {
      directions = directions[0].split('\n').map((e) => e.trim()).filter((e) => e.length);
    }
    extractedData.directions = directions;
  }

  if (extractedData.ingredients.length && extractedData.directions.length) {
    return extractedData;
  }

  return -1;
};

module.exports = { attemptLDScrape, attemptExtractByProps };
