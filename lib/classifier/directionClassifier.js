const natural = require('natural');

const determineDirectionSet = async (initialSet, indexOf = 1) => {
  const directionSet = [];

  return new Promise((resolve, reject) => {
    // loading pre-trained set
    natural.LogisticRegressionClassifier.load('classifier.json', null, function (err, classifier) {
      if (err) reject(err);

      for (let i = indexOf; i < initialSet.length; i++) {
        const element = initialSet[i];
        const classification = classifier.getClassifications(element);
        const probability = getProbability(classification, 'directions');

        let nextProb, prevProb;
        if (i < initialSet.length - 1) {
          const nextElement = initialSet[i + 1];
          const nextClass = classifier.getClassifications(nextElement);
          nextProb = getProbability(nextClass, 'directions');
        }

        if (i > 1) {
          const prevElement = initialSet[i - 1];
          const prevClass = classifier.getClassifications(prevElement);
          prevProb = getProbability(prevClass, 'directions');
        }

        if ((probability >= 0.95 && nextProb >= 0.95) || (probability >= 0.95 && prevProb >= 0.95)) {
          directionSet.push(element);
        }
      }
      resolve(directionSet);
    });
  });
};

const getProbability = (obj, input) => {
  return obj.filter((el) => el.label === input)[0].value;
};

module.exports = determineDirectionSet;
