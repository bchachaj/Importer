const natural = require('natural');
const classifier = new natural.LogisticRegressionClassifier();
const recipes = require('./recipes.json');
const recipes_train = require('./recipes_train.json');
const ingredients_train = require('./ingredients_train.json');

const executeTraining = () => {
  console.log('Loading training set: this may take a few minutes. Please wait..');

  // inital training data

  classifier.addDocument('Heat oven to 425 degrees. Spread the bread cubes on a rimmed baking sheet and toss with 2 tablespoons oil and a pinch of salt. Bake until they are dried out and pale golden brown at the edges, about 7 to 15 minutes. Let cool on a wire rack.', 'directions');
  classifier.addDocument('Cut tomatoes into bite-size pieces and transfer to a large bowl. Add mozzarella, onions, garlic paste, 1 tablespoon vinegar, oregano or thyme, 1/4 teaspoon salt and the red pepper flakes if using. Toss to coat and set aside.', 'directions');
  classifier.addDocument('In a medium bowl, combine remaining 1 tablespoon vinegar, the mustard, 1/4 teaspoon salt and some black pepper to taste. While whisking constantly, slowly drizzle in the remaining 4 tablespoons olive oil until the mixture is thickened. Stir in cucumbers, basil and parsley.', 'directions');
  classifier.addDocument('Add bread cubes, cucumber mixture and capers to the tomatoes and toss well. Let sit for at least 30 minutes and up to 4 hours before serving. Toss with a little more olive oil, vinegar and salt if needed just before serving.', 'directions');
  classifier.addDocument('Combine garlic, gochujang, rice syrup, sesame oil, and vegetable oil in a large bowl. Mix it well with a wooden spoon until the gochujang is not separated with the oil and well incorporated. Set aside.', 'directions');
  classifier.addDocument('Open the package of pollock. Put it on a platter or your cutting board and check each piece for fishbones. If you find any, pull them out and throw them away.', 'directions');
  classifier.addDocument('Put the dried pollock into a plastic bag. Add ¼ cup water evenly to the pollock and close the bag. Grab the bag with one hand to seal it, and mix and massage the pollock with your other hand so that it moistens evenly. Let it sit for 10 minutes.', 'directions');
  classifier.addDocument('Pound the pollock in the plastic bag with a pestle or any object like a rock, bottle, or rolling pin for about 1 minute, to soften the pollock and make it flaky.', 'directions');
  classifier.addDocument('Transfer it to an air-tight container.', 'directions');
  classifier.addDocument('Put some into a small plate and serve with rice. You can refrigerate it for up to 1 month.', 'directions');
  classifier.addDocument('Place the flour, milk powder, baking soda and baking powder in a large bowl. Using a balloon whisk, stir the dry ingredients together until well blended. Place 12 cookies (roughly 135 g or 1 row of a standard Oreo package) in a food processor and pulse until they are crushed to a powder. Chop the remaining 24 cookies (279 g or 2 rows of a standard Oreo package) roughly into chunks.', 'directions');
  classifier.addDocument(' Place the butter, both sugars, salt and vanilla in the bowl of a stand mixer fitted with a paddle attachment. Cream together on medium speed until a paste form that is uniform in color. Add the eggs, one at a time, waiting for the first one to incorporate before adding the second one. Add the crushed Oreo powder to the bowl and mix on medium speed until blended in.', 'directions');
  classifier.addDocument('Add the blended dry ingredients to the dough and mix until it is absorbed. Remove the bowl from the mixer and add half the chopped Oreos to the dough, reserving the other half for later. Using a wooden spoon, carefully blend the chopped cookies into the dough, trying not to break the chocolate cookies too much. Wrap the dough tightly in plastic wrap and refrigerate overnight.', 'directions');
  classifier.addDocument('The next day, preheat the oven to 350ºF. Line a baking sheet with parchment paper or a Silipat. Take the dough out of the fridge and scoop out a round ball about the size of a golf ball. Place the dough on the baking sheet and slightly press down so a disk forms, about 1-inch thick. Press two or three pieces of the reserved chopped Oreos on to the cookie dough disk, and then sprinkle a little Maldon salt on top if using. Repeat, making sure the cookie dough is set 2 inches apart from each other (the dough will spread). Bake in the oven for 14-16 minutes or until the edges of the cookies start to turn a deep golden brown but the inside of the cookie is still a lighter brown. Let cool on the baking pan for 10 minutes before moving to a wire rack to cool completely.', 'directions');

  // additional training

  for (let i = 0; i < recipes.recipes.length; i++) {
    const recipe = recipes.recipes[i];
    const ingredients = recipe.ingredients;
    const directions = recipe.steps;

    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      classifier.addDocument(dir.text, 'directions');
    }

    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];
      const format_ing = `${ing.amount} ${ing.unit} ${ing.name}`;
      classifier.addDocument(format_ing, 'ingredient');
    }
  }

  // limit recipes for training per current performance
  for (let i = 0; i < 6; i++) {
    const recipe = recipes_train[i];
    const ingredients = recipe.Ingredients;
    const directions = recipe.Method;

    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      classifier.addDocument(dir, 'directions');
    }

    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];
      classifier.addDocument(ing, 'ingredient');
    }
  }

  for (let i = 0; i < ingredients_train.length; i++) {
    const ingredient = ingredients_train[i];
    const ingredients = ingredient.ingredients;

    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];
      const quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '½', '⅓', '⅔', '¼', '¾', '⅕', '⅖', '⅗', '⅘', '⅙', '⅚', '⅐', '⅛', '⅜', '⅝', '⅞', '⅑', '⅒'];
      const units = ['teaspoon', 'teaspoons',
        'tablespoon', 'tablespoons', 'tbl', 'tbs', 'tbsp',
        'fluid ounce', 'fl oz',
        'cup', 'cups', 'pint', 'pints', 'p', 'quart', 'quarts',
        'ml'
      ];
      var randomUnit = units[Math.floor(Math.random() * units.length)];
      var randomQuantity = quantity[Math.floor(Math.random() * quantity.length)];
      classifier.addDocument(`${randomQuantity} ${randomUnit} ${ing}`, 'ingredient');
    }
  }

  classifier.train();

  classifier.save('classifier.json', function (err, classifier) {
    if (err) console.log(err);

    console.log('Trained and saved classifier, ready for requests.');
  });
};

module.exports = { executeTraining, classifier };
