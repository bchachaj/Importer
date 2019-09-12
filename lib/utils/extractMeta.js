// utilies to parse available metadata

// try to get JSON Linked Data if available on page (Schema.org)
const attemptLDScrape = ($) => {
    const findScriptSchema = $('script[type="application/ld+json"]');
    
    if (findScriptSchema.length) {
        let scriptString = findScriptSchema.html().trim();
        
        // replace char(160) which breaks JSON parse
        scriptString = scriptString.replace(/\s+/g, " ")
        recipeSchemaObject = JSON.parse(scriptString);
        
        const ingredients = recipeSchemaObject["recipeIngredient"];
        // split into sentences for now
        const directions = recipeSchemaObject["recipeInstructions"].split('. ');

        extractedData.push(ingredients, directions);
        return [ingredients, directions];
    }

    return -1; 
}

// search DOM for node types that co-incide with Schema structure
const attemptExtractByProps = ($) => {
    const findIngredients; 
    const findInstructions;


    return -1; 
     
}

module.exports = { attemptLDScrape, attemptExtractByProps };