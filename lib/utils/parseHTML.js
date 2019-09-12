const stripHTML = require('string-strip-html');
const cheerio = require('cheerio');
const determineIngredientSet = require('./../classifier/ingredientClassifier');
const determineDirectionSet = require('./../classifier/directionClassifier');

const { attemptExtractByProps, attemptLDScrape } = require('./extractMeta');

//would expand target keyword set to scale 
const INGREDIENTS = "Ingredients";
const DIRECTIONS = "Directions"; // || "Preparation" 

const parseHTML = async (html) => {
    const $ = cheerio.load(html, {xmlMode: false});
    const extractedData = [];

    const findScriptSchema = $('script[type="application/ld+json"]');

    if(findScriptSchema.length) {
        let scriptString = findScriptSchema.html().trim();

        // replace char(160) which breaks JSON parse
        scriptString = scriptString.replace(/\s+/g, " ")
        recipeSchemaObject = JSON.parse(scriptString); 

        const ingredients = recipeSchemaObject["recipeIngredient"];
        // split into sentences for now
        const directions = recipeSchemaObject["recipeInstructions"].split('. ');

        extractedData.push(ingredients, directions);
        return extractedData;
    }

    //returns a narrower slice of dom tree if possible
    const ingredientSection = findLikelyDOMNode(INGREDIENTS, $);
    const ingredientSet = await extractSetWithClassifer(...ingredientSection, determineIngredientSet);

    const directionSection = findLikelyDOMNode(DIRECTIONS, $);
    const directionSet = await extractSetWithClassifer(...directionSection, determineDirectionSet);

    return [ingredientSet, directionSet]
}

const findLikelyDOMNode = (target, $) => {
    for (let i = 0; i <= 4; i++) {
        // based on examples, dom nodes with target text are siblings to a 'header' element
        //so, we find first matching one if we can, and send it along 

        const header = $(`h${i}:contains(${target})`);
        // if(target.length > 1)
        if (header.text().length) {
            // if match, send along parent (would need to be adjusted to search out if header was nested)
            const match = $.html(header.parent());

            //generate array of strings from html 
            const ingredientSection = stripHTML(match).split('\n');

            //micro-optimization, don't have to search before target for set 
            const indexOf = ingredientSection.indexOf(target);
            return [ingredientSection, indexOf];
        }
    }
    
    // if no likely section found, return entire dom tree as array of strings and start from top
    return [stripHTML($.html()).split('\n'), 1];
}


const extractSetWithClassifer = async (section, indexOf = 1, classifier) => {
    try {
        const set = await classifier(section, indexOf);
        return set;

    } catch (error) {
        console.log(error)
    }
}

module.exports = parseHTML;