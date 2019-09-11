const natural = require('natural');
var classifier = new natural.LogisticRegressionClassifier();


const determineIngredientSet = (initialSet, indexOf = 1) => {
    const ingredientSet = [];

    //loading pre-trained set 
    // lib / classifier / ingredient_classifier.json
    natural.LogisticRegressionClassifier.load('ingredient_classifier.json', null, function (err, classifier) {
        for (let i = indexOf; i < initialSet.length; i++) {
            const element = initialSet[i];
            console.log(classifier); 
            // const classification = classifier.getClassifications("elerement")
            // const probability = classification; 

            // console.log(probability)
            // if(probability >= 0.55) {
            //     ingredientSet.push(element);
            // }
            
        }    
    });
    
    return ingredientSet;

}  



module.exports = determineIngredientSet;