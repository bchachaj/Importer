"use strict";

const express = require('express');
const URL = require('url').URL;
// const metascraper = require('metascraper')([
//     require('metascraper-title')(),
// ]);
const axios = require('axios');
const parseHTML = require('./utils/parseHTML');
const app = express();

const { executeTraining } = require('./classifier/train/train_classifier');

// init with training classifier 
executeTraining();

app.get('/recipes', async (req, res) => {
    // const { url } = req.query;/
    // const targetUrl = req.query.url; 
    // if(!validateURL(targetUrl)) {
    //     res.status(422).send("Must provide a vaid URL")
    // }

    let targetUrl = 'https://www.maangchi.com/recipe/bugeopo-gochujang-muchim';
    let targetUrl2 = 'https://www.eatthelove.com/cookies-and-cream-cookies/';
    let targetUrl3 = 'https://cooking.nytimes.com/recipes/1017518-panzanella-with-mozzarella-and-herbs/';
    let targetUrl4 = 'http://www.laurainthekitchen.com/recipes/croque-madam/';
    const response = await axios.get(targetUrl4);
    const { data: html } = response; 

    const extractedData = await parseHTML(html);

    const jsonRecipe = buildResponseObject(...extractedData);
    // const { url } = response.config; 
    // const metadata = await metascraper({ html, url })

    res.send(jsonRecipe);

});


function buildResponseObject(ingredients, directions, name) {
    // if possible, we further parse ingredients into more granular structure 
    const formatIngredients = [];

    const responseObject = { 
        steps: directions, 
        ingredients: ingredients,
        name: name
    }

    return responseObject;
}


function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}


app.listen('8080', () => {
    console.log('listening on 8080')
});