const natural = require('natural');
const { classifier } = require('./train/train_classifier');


const determineIngredientSet = async (initialSet, indexOf = 1) => {
    const ingredientSet = [];
    const fractions = ["½", "⅓", "⅔", "¼", "¾", "⅕", "⅖", "⅗", "⅘", "⅙", "⅚", "⅐", "⅛", "⅜", "⅝", "⅞", "⅑", "⅒"];

    return new Promise((resolve, reject) => {

        //loading pre-trained set 
        natural.LogisticRegressionClassifier.load("classifier.json", null, function (err, classifier) {
            for (let i = indexOf; i < initialSet.length; i++) {
                let element = initialSet[i];

                // deal with unit being on seperate line
                // if(!isNaN(element) && element.length <= 4 || fractions.includes(element)) {
                //     element = `${element} ${initialSet[i+1]}`;
                //     i++
                // }

                // if (element == '½') {
                //     console.log('IKWEJTGFOITJ$@ITJ)(@#$(TRIJGF')
                // }

                const classification = classifier.getClassifications(element);
                const probability = classification.filter((el) => el.label == "ingredient")[0].value;

                let nextProb, prevProb;
                if (i < initialSet.length - 1) {
                    const nextElement = initialSet[i + 1];
                    const nextClassification = classifier.getClassifications(nextElement);
                    nextProb = nextClassification.filter((el) => el.label == "ingredient")[0].value;
                }

                if (i > 1) {
                    const prevElement = initialSet[i - 1];
                    const prevClassification = classifier.getClassifications(prevElement);
                    prevProb = prevClassification.filter((el) => el.label == "ingredient")[0].value;
                }

                if (probability >= 0.55 && nextProb >= .55 || probability >= .55 && prevProb >= .55) {
                    ingredientSet.push(element);
                }

            }
            resolve(ingredientSet);
        });

    })

}



module.exports = determineIngredientSet;