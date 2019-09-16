const fs = require("fs");
const parseHTML = require('../lib/utils/parseHTML');
// path.join(__dirname, '/start.html')
const path = require('path');
const cheerio = require('cheerio');

const html = fs.readFileSync(path.join(__dirname, '/recipe.html'));
const url = "https://cooking.nytimes.com/recipes/1017518-panzanella-with-mozzarella-and-herbs";
const { attemptExtractByProps } = require('./../lib/utils/extractMeta');
const recipe = require('./recipe.json');


const assert = require('assert');

describe('hooks', function () {
    let extracted, attemptedProps;
    before(async function () {
        extracted = await parseHTML(html, url);
        attemptedProps = attemptExtractByProps(cheerio.load(html))
    });

    describe('parseHTML - extract props', async function () {

        it('detects presence of schema props', function () {
            assert.notEqual(attemptedProps, -1);
        });

        it('correctly returns article name', async function () {
            assert.equal(extracted.name, recipe.name);
        });

        it('correctly returns recipe ingredient data', async function () {
            const extracted = await parseHTML(html, url);
            assert.equal(extracted.ingredients.length, recipe.ingredients.length);

        });
        it('correctly returns recipe direction data', async function () {
            const extracted = await parseHTML(html, url);
            assert.equal(extracted.directions[0].length, recipe.steps.join(" ").length);

        });

    });

});


