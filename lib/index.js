"use strict";

const express = require('express');
const URL = require('url').URL;
// const metascraper = require('metascraper')([
//     require('metascraper-title')(),
// ]);
const axios = require('axios');
const $ = require('cheerio');


const parseHTML = require('./utils/parseHTML');

const app = express();


app.get('/recipes', async (req, res) => {
    // const { url } = req.query;
    // const targetUrl = req.query.url; 
    // if(!validateURL(targetUrl)) {
    //     res.status(422).send("Must provide a vaid URL")
    // }
    let targetUrl = 'https://www.maangchi.com/recipe/bugeopo-gochujang-muchim';
    const response = await axios.get(targetUrl);
    const { data: html } = response; 

    const extractedData = parseHTML(html);
    // const { url } = response.config; 
    // const metadata = await metascraper({ html, url })

});


function buildResponseObject(name, ingredients, steps) {
    const obj = Object.assign({}, name, ingredients, steps);
    // response = Object.assign(title, ...response);
    return obj;
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