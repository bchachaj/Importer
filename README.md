# Importer

## **Instructions:**

Install dependencies 

`npm install`

Start server

`npm start`

Test  
`npm run test`


Usage 

Make a `GET` request having the parameter `url` that contains the webpage you would like to extract JSON from 

----
## **About**

This application provides an API endpoint that supplied a recipe webpage URL, extracts relevant data into JSON format 

While developed against select examples, out of the box it can parse a number of online sources such as any recipe form allrecipes.com 

I used a two-pronged approach to collecting data from these websites after collecting the HTML markup from the provided URL: 

- Check for the existence of metadata objects, and collect relevant information
- If no sufficient metadata, manually parse the HTML and utilize natural language processing to extract data with some degree of confidence 

At the moment, a [logistic regression classifier](https://github.com/NaturalNode/natural#bayesian-and-logistic-regression) trained against a tiny set of recipes is used by a naive algorithm to classify whether an string is an "Ingredient" or a "Direction". The algorithm checks if the string's neighbors also have similar classifications, and if so a set is generated to be provided to the JSON response. There are some performance optimizations that cater to the example recipes developed against, which in theory prevent having to parse the entire HMTL response if necessary. 

I originally had wanted to attempt to use machine learning to parse the unstructured ingredient phrases from the HTML (from scratch). However, after learning what [how involved that can be](https://open.blogs.nytimes.com/2015/04/09/extracting-structured-data-from-recipes-using-conditional-random-fields/?_r=0), I settled on an existing Node library that does the task relatively well. It could be rebuilt to better parse unicode fractions, but other than that it handles a suitable number of use cases. 



**Findings:** 

Collecting metadata is always preferred because the page publishers is declaring that these are the relevant components, so we can take advantage of that. 

In the limited time developing this, I had some difficulty finding a suitable training set for the classifier. For example, I found a large collection of recipes in JSON that I thought would be good, however it appears that because it happenede they were all Christmas-related that led to the classifier having lower confidence with certain cuisines.  

With a large, diverse training set and more robust traversal algorithm, I believe this library could be extended to handle a majority of internet recipes. 

The strategy then would be to collect potential sets from the HTML, and return the set with the highest average confidence score amongst all collected.
___


Examples to test against: 

* https://cooking.nytimes.com/recipes/1017518-panzanella-with-mozzarella-and-herbs
* https://www.eatthelove.com/cookies-and-cream-cookies/
* https://www.maangchi.com/recipe/bugeopo-gochujang-muchim
* http://www.laurainthekitchen.com/recipes/croque-madam/