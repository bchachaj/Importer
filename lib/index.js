"use strict";

const express = require('express');
const URL = require('url').URL;
const axios = require('axios');
const parseHTML = require('./utils/parseHTML');
const app = express();

const { buildResponseObject } = require("./utils/buildResponseObject");
const { executeTraining } = require('./classifier/train/train_classifier');

// init program with training classifier 
executeTraining();

app.get('/recipes', async (req, res) => {
    const targetUrl = req.query.url; 

    if(!validateURL(targetUrl)) {
        res.status(422).send("Must provide a vaid URL")
    }

    const response = await axios.get(targetUrl);
    const { data: html } = response; 
    const extractedData = await parseHTML(html, targetUrl);

    const jsonRecipe = buildResponseObject(extractedData);

    res.send(jsonRecipe).status(200);

});


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