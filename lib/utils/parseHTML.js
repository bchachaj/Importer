const stripHTML = require('string-strip-html');
// var tidy = require("tidy-html5").tidy_html5
const cheerio = require('cheerio');
const determineIngredientSet = require('./../classifier/ingredientClassifier');
const determineDirectionSet = require('./../classifier/directionClassifier');

//would expand target keyword set to scale app 
const INGREDIENTS = "Ingredients";
const DIRECTIONS = "Directions"; // || "Preparation" 

const parseHTML = async (html) => {
    const $ = cheerio.load(html, {xmlMode: false});
    const extractedData = [];

    const findScriptSchema = $('script[type="application/ld+json"]');
    let appSchema = []; 

    if(findScriptSchema.length) {
        const scriptString = findScriptSchema.html().trim();
        const scriptStringArray = scriptString.split("\n").map((e) => e.trim());
        const filteredScript = scriptStringArray.map((e) => {
            if (e.includes("recipeInstructions\": ")) {
                e.replace("recipeInstructions\": ", "");
            }
            if (e.includes("recipeIngredient\": [")) {
                e.replace("recipeIngredient\": [", "");
            } 
            return e; 
        })
        // const extractIng = await extractSetWithClassifer(filteredScript, determineIngredientSet)
        // const extractDirections = await extractSetWithClassifer(filteredScript, determineDirectionSet)
        console.log(filteredScript)

    }

    //returns a narrower slice of dom tree if possible
    const ingredientSection = findLikelyDOMNode(INGREDIENTS, $);
    //generate set for JSON response
    const ingredientSet = await extractSetWithClassifer(...ingredientSection, determineIngredientSet);

    const directionSection = findLikelyDOMNode(DIRECTIONS, $);
    const directionSet = await extractSetWithClassifer(...directionSection, determineDirectionSet);

    return [ingredientSet, directionSet]
}

function escapeSpecialChars(jsonString) {

    return jsonString.replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f");

}


const findLikelyDOMNode = (target, $) => {
    for (let i = 0; i <= 4; i++) {
        // based on examples, dom nodes with target text are siblings to a 'header' element
        //so, we find first matching one if we can, and send it along 

        const header = $(`h${i}:contains(${target})`);
        // if(target.length > 1)
        if (header.text().length) {
            // if match, send along parent (would need to be adjusted to search out if header was nested)
            // const match = tidy($.html(header.parent()), { "indent": true })
            const match = $.html(header.parent());

            //generate array of strings from html 
            // console.log(match.trim());
            const ingredientSection = stripHTML(match).split('\n');

            //micro-optimization, don't have to search before target for set 
            const indexOf = ingredientSection.indexOf(target);
            return [ingredientSection, indexOf];
        }
    }

    //no match :(
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