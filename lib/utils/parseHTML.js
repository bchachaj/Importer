const stripHTML = require('string-strip-html');
// var tidy = require("tidy-html5").tidy_html5
const cheerio = require('cheerio');
const determineIngredientSet = require('./../classifier/ingredientClassifier');
const determineDirectionSet = require('./../classifier/directionClassifier');


//would expand target keyword set to scale app 
const INGREDIENTS = "Ingredients";
const DIRECTIONS = "Directions";
// const DIRECTIONS = ["Directions", "Preparation"];

const parseHTML = async (html) => {
    const $ = cheerio.load(html);

    //returns a narrower slice of dom tree 
    const ingredientSection = findLikelyDOMNode(INGREDIENTS, $);
    const directionSection = findLikelyDOMNode(DIRECTIONS, $);

    // console.log(ingredientSection, directionSection)
    const ingredientSet = await extractSetWithClassifer(...ingredientSection, determineIngredientSet);
    const directionSet = await extractSetWithClassifer(...directionSection, determineDirectionSet);

    console.log(ingredientSet, directionSet);
    // const ingredientSet = extractSetWithClassifer(sanitizedIngredientTarget.html)

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
    // console.log("not a", section)
    try {
        const set = await classifier(section, indexOf);
        return set;

    } catch (error) {
        console.log(error)
    }
}

module.exports = parseHTML; 