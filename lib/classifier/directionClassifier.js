const natural = require('natural');
const { classifier } = require('./train/train_classifier');


const determineDirectionSet = async (initialSet, indexOf = 1) => {
    const directionSet = [];

    return new Promise((resolve, reject) => {
        //loading pre-trained set 
        natural.LogisticRegressionClassifier.load("classifier.json", null, function (err, classifier) {
            if (err) reject(err);

            for (let i = indexOf; i < initialSet.length; i++) {
                const element = initialSet[i];
                const classification = classifier.getClassifications(element);
                const probability = classification.filter((el) => el.label == "directions")[0].value;

                let nextProb, prevProb;
                if (i < initialSet.length - 1) {
                    const nextElement = initialSet[i + 1];
                    const nextClassification = classifier.getClassifications(nextElement);
                    nextProb = nextClassification.filter((el) => el.label == "directions")[0].value;
                }

                if (i > 1) {
                    const prevElement = initialSet[i - 1];
                    const prevClassification = classifier.getClassifications(prevElement);
                    prevProb = prevClassification.filter((el) => el.label == "directions")[0].value;
                }

                if (probability >= 0.95 && nextProb >= .95 || probability >= .95 && prevProb >= .95) {
                    directionSet.push(element);
                }


            }
            resolve(directionSet);
        });

    })

}



module.exports = determineDirectionSet;