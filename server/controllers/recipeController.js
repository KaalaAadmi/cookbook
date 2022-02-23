require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

// GET /homepage
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };
    res.render("index", { title: "Cook Book - Homepage", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// GET /categories
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", { title: "Cook Book - Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// GET /Recipe/:id
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Cook Book - Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// GET /categories/:id
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categoryById", {
      title: "Cook Book - Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// POST /search
exports.searchRecipe = async (req, res) => {
  // searchTerm
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    // res.json(recipe);
    res.render("search", { title: "Cook Book - Search", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// GET /explore-latest
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Cook Book - Explore-Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// GET /explore-random
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Cook Book - Explore-Random",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// GET /submit-recipe
exports.submitRecipe = async (req, res) => {
  try {
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObj = req.flash("infoSubmit");
    res.render("submit-recipe", {
      title: "Cook Book - Submit Recipe",
      infoErrorsObj,
      infoSubmitObj,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// POST /submit-recipe
exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    // res.json(error);
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

// GET /about
exports.aboutMe = async (req, res) => {
  try {
    res.render("about", { title: "Cook Book - About Me" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

// GET /contact
exports.contactMe = async (req, res) => {
  try {
    res.render("contact", { title: "Cook Book - Contact Me" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
// UPDATE RECIPE
async function updateRecipe() {
  try {
    const res = await Recipe.updateOne(
      { name: "Chicken Dum Biryani" },
      { $set: { image: "1641324360428Chicken Dum Biryani.png" } }
    );
    res.n;
    res.nModified;
  } catch (error) {
    console.log(error);
  }
}
updateRecipe();

// DELETE RECIPE
// async function deleteRecipe(){
//   try{
//     const res = await Recipe.deleteOne({name: 'New Recipe Updated'});
//     res.n;
//     res.nModified;
//   } catch(error){
//     console.log(error);
//   }
// }
// deleteRecipe();

// async function insertDummyCategoryData(){
//     try{
//         await Category.insertMany([
//             {
//                 name: "Japanese",
//                 image: "thai-food.jpg"
//             },
//             {
//                 name: "Lebanese",
//                 image: "american-food.jpg"
//             },
// //             {
// //                 name: "French",
// //                 image: "chinese-food.jpg"
// //             },
// // {
// //     name: "Mexican",
// //     image: "mexican-food.jpg"
// // },
// // {
// //     name: "Indian",
// //     image: "indian-food.jpg"
// // },
// // {
// //     name: "Spanish",
// //     image: "spanish-food.jpg"
// // }
//         ]);
//     } catch(error) {
//         console.log('err', + error);
//     }
// }

// insertDummyCategoryData();

async function insertDummyRecipeData() {
  try {
    await Recipe.insertMany([
      {
        name: "Chicken Ramen",
        description: `1. Put the chicken, soy sauce, mirin and sesame oil in a bowl and set aside to marinate.
        2. For the broth, put the chilli, garlic, ginger and stock in a large saucepan. Simmer over a medium heat and cook for 15 minutes, then strain and return the liquid to the pan (discard the solids). Add the carrots and mushrooms and cook for another 5 minutes until softened. Season to taste with salt and sesame oil.
        3. Before the end of the cooking time, blanch the broccoli in the broth for 2-3 minutes until tender, then remove with a slotted spoon and set aside. While the broth simmers, cook the noodles according to the pack instructions, then drain and set aside.
        4. To cook the chicken, heat a griddle pan or frying pan over a high heat. Remove the chicken from the marinade and cook for 4 minutes on each side or until cooked all the way through and the chicken has deep char marks. Remove from the heat and slice.
        5. Arrange the noodles in bowls with the broccoli, chicken slices, beansprouts, spring onions and soft boiled eggs. Ladle over the hot broth with the carrots and mushrooms, then serve straightaway garnished with fresh coriander and mint.
        `,
        email: "arnav264@gmail.com",
        ingredients: ["4 free-range skinless, boneless chicken thighs",
        "50ml low sodium soy sauce",
        "50ml mirin (Japanese rice wine, from supermarkets)",
        "1 tbsp toasted sesame oil",
        "150g tenderstem broccoli, sliced into bite-size pieces",
        "300g pack ramen noodles (see tip)",
        "100g fresh beansprouts",
        "6 spring onions, finely sliced",
        "4 medium free-range eggs, soft boiled and halved",
        "Handful fresh coriander leaves",
        "Handful fresh mint leaves",
        "FOR RAMEN BROTH",
        "1 red chilli, thinly sliced",
        "1 garlic clove, thinly sliced",
        "1 thumb-size piece fresh ginger, thinly sliced",
        "1.5 litres best quality chicken stock",
        "2 large carrots, julienned (cut into matchsticks)",
        "100g shiitake mushrooms, halved if large",
        "1 tsp sesame oil",
        
        ],
        category: "Japanese",
        image: "1641387520807Chicken Ramen.png",
      },
      {
        name: "Spicy Chicken Lettuce Wraps",
        description: `1. Sprinkle chicken with pepper. In a large skillet or wok, stir-fry chicken in 1 tablespoon oil until no longer pink. Remove and set aside.
        2. Stir-fry onion and peppers in remaining oil for 5 minutes. Add the water chestnuts, mushrooms and garlic; stir-fry 2-3 minutes longer or until vegetables are crisp-tender. Add stir-fry sauce and soy sauce. Stir in chicken; heat through.
        3. Place 1/2 cup chicken mixture on each lettuce leaf; sprinkle each with 1-1/2 teaspoons peanuts and 1/4 teaspoon cilantro. Fold lettuce over filling.
        `,
        email: "arnav264@gmail.com",
        ingredients: [
          "1 pound chicken tenderloins, cut into 1/2-inch pieces",
"1/8 teaspoon pepper",
"2 tablespoons canola oil, divided",
"1 medium onion, finely chopped",
"1 small green pepper, finely chopped",
"1 small sweet red pepper, finely chopped",
"1 can (8 ounces) sliced water chestnuts, drained and finely chopped",
"1 can (4 ounces) mushroom stems and pieces, drained and finely chopped",
"2 garlic cloves, minced",
"1/3 cup stir-fry sauce",
"1 teaspoon reduced-sodium soy sauce",
"8 Bibb or Boston lettuce leaves",
"1/4 cup salted peanuts",
"2 teaspoons minced fresh cilantro",

        ],
        category: "Chinese",
        image: "1641387520807Spicy CHicken Lettuce Wraps.png",
      },
      {
        name: "Chicken Shawarma",
        description: `1.In a glass baking dish, mix together the malt vinegar, 1/4 cup yogurt, vegetable oil, mixed spice, cardamom, salt and pepper.
        2.Place the chicken thighs into the mixture and turn to coat. Cover and marinate in the refrigerator for at least 4 hours or overnight.
        3.Preheat the oven to 350 degrees F (175 degrees C).
        4.In a small bowl, mix together the tahini, 1/4 cup yogurt, garlic, lemon juice, olive oil, and parsley.
        5.Season with salt and pepper, taste, and adjust flavors if desired. Cover and refrigerate.
        6.Cover the chicken and bake in the marinade for 30 minutes, turning once.
        7.Uncover, and cook for an additional 5 to 10 minutes, or until chicken is browned and cooked through.
        8.Remove from the dish, and cut into slices.
        9.Place sliced chicken, tomato, onion, and lettuce onto pita breads.
        10.Roll up, and top with tahini sauce.`,
        email: "arnav264@gmail.com",
        ingredients: [
          "8 Boneless chicken thighs (skinless)",
"For the marinade:",
"1/2 cup malt vinegar",
"1/4 cup plain yogurt",
"1 tbsp vegetable oil",
"to taste salt and pepper",
"1/4 tsp freshly ground cardamom",
"1 tsp All spice powder",
"For the sauce:",
"1/2 cup tahini",
"1/4 cup plain yogurt",
"1/2 tsp garlic (minced)",
"2 tbsp lemon juice",
"1 tbsp olive oil",
"1 tbsp fresh parsley, chopped",
"to taste salt and pepper",
"For plating:",
"4 medium tomatoes, sliced",
"1/2 cup onion, sliced",
"4 cups lettuce, shredded",
"8 Pita bread rounds",

        ],
        category: "Indian",
        image: "1641387520807Chicken Shawarma.png",
      },
    ]);
  } catch (error) {
    console.log("err", +error);
  }
}

insertDummyRecipeData();
