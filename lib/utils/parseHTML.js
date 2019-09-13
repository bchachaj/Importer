const stripHTML = require('string-strip-html');
const cheerio = require('cheerio');
const metascraper = require('metascraper')([
    require('metascraper-title')(),
]);

const determineIngredientSet = require('./../classifier/ingredientClassifier');
const determineDirectionSet = require('./../classifier/directionClassifier');

const { attemptExtractByProps, attemptLDScrape } = require('./extractMeta');

//could expand target keyword set to scale 
const INGREDIENTS = "Ingredients";
const DIRECTIONS = "Directions"; // || "Preparation" 

const parseHTML = async (html, url) => {
    const $ = cheerio.load(html);
    const metadata = await metascraper({ html, url });
    
    let extractedData = {
        ingredients: [],
        directions: [],
        name: "Name"
    };

    const attemptedSchemaScrape = attemptLDScrape($);
    const attemptedPropScrape = attemptExtractByProps($);

    if (attemptedSchemaScrape !== -1) {
        extractedData = attemptedSchemaScrape;
    } else if(attemptedPropScrape !== -1) {
    
        //direction props more likely to be malformed, so have backup    
        const directionSection = findLikelyDOMNode(DIRECTIONS, $);
        const directionSet = await extractSetWithClassifer(...directionSection, determineDirectionSet);
        
        extractedData = attemptedPropScrape;

        if(attemptedPropScrape.directions.length < directionSet.length) {
            extractedData.directions = directionSet;
        }

    } else {
        //no reliable schema, procede to manually parse 

        //findLikelyDOMNODE returns a narrower slice of dom tree to traverse if possible
        const ingredientSection = findLikelyDOMNode(INGREDIENTS, $);
        const ingredientSet = await extractSetWithClassifer(...ingredientSection, determineIngredientSet);

        const directionSection = findLikelyDOMNode(DIRECTIONS, $);
        const directionSet = await extractSetWithClassifer(...directionSection, determineDirectionSet);
        
        extractedData.ingredients = ingredientSet;
        extractedData.directions = directionSet;
    }

    extractedData.name = metadata.title
    return extractedData;
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