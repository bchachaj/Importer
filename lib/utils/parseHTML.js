const stripHTML = require('string-strip-html');
const cheerio = require('cheerio');
const determineIngredientSet = require('./../classifier/ingredientClassifier');

//would expand target keyword set to scale app 
const INGREDIENTS = "Ingredients";
const DIRECTIONS = "Directions";

const parseHTML = (html) => {
    const $ = cheerio.load(html);

    //returns a narrower slice of dom tree 
    const ingredientSection = findLikelyDOMNode(INGREDIENTS, $);
    // const sanitizedDirectionTarget = findLikelyDOMNode(DIRECTIONS, $);

    const ingredientSet = extractSetWithClassifer(...ingredientSection, determineIngredientSet);
    // return ingredientSection
    // const ingredientSet = extractSetWithClassifer(sanitizedIngredientTarget.html)

}


const findLikelyDOMNode = (target, $) => {
    for (let i = 0; i <= 4; i++) {
        // based on examples, dom nodes with target text are siblings to a 'header' element
        //so, we find first matching one if we can, and send it along 

        const header = $(`h${i}:contains(${target})`);
        if (header.text().length) {
            // if match, send along parent (would need to be adjusted to search out if header was nested)
            const match = $.html(header.parent())
            //generate array of strings from html 
            const ingredientSection = stripHTML(match).split('\n');

            //micro-optimization, don't have to search before target for set 
            const indexOf = ingredientSection.indexOf(target);

            return [ ingredientSection, indexOf ];
        }
    }

    //no match :(
    return $;
}


const extractSetWithClassifer = (ingredientSection, indexOf, classifier) => {
    return classifier(ingredientSection, indexOf);
}

module.exports = parseHTML; 