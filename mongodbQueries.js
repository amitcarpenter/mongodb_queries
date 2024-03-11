const { count } = require("console");
const express = require("express");
const mongoose = require("mongoose");

const Restaurants = mongoose.model("restaurant", {});

const router = express.Router();

// 1. Write a MongoDB query to display all the documents in the collection restaurants.
router.get("/all-document", async (req, res) => {
  try {
    const Restaurants_data = await Restaurants.find();
    res.json(Restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 2. Write a MongoDB query to display the fields restaurant_id, name, borough and cuisine for all the documents in the collection restaurant.
router.get("/display-only-selected-fields", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {},
      { restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
    );
    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 3. Write a MongoDB query to display the fields restaurant_id, name, borough and cuisine, but exclude the field _id for all the documents in the collection restaurant.
router.get("/displaly-fields-but-exclude-id", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {},
      { restaurant_id: 1, name: 1, borough: 1, cuisine: 1, _id: 0 }
    );
    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 4. Write a MongoDB query to display the fields restaurant_id, name, borough and zip code, but exclude the field _id for all the documents in the collection restaurant.
router.get("/again-fields-display", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {},
      { restaurant_id: 1, name: 1, borough: 1, "address.zipcode": 1, _id: 0 }
    );
    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 5. Write a MongoDB query to display all the restaurant which is in the borough Bronx.
router.get("/filter-query", (req, res) => {
  try {
    Restaurants.find({ borough: "Bronx" })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (error) {
    console.log(error);
  }
});

// 6. Write a MongoDB query to display the first 5 restaurant which is in the borough Bronx.
router.get("/display-limit-of-restaurant", (req, res) => {
  try {
    Restaurants.find({ borough: "Bronx" })
      .limit(5)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (error) {
    console.log(error);
  }
});

// 7.Write a MongoDB query to display the next 5 restaurants after skipping first 5 which are in the borough Bronx.
router.get("/skip-and-limit", (req, res) => {
  try {
    Restaurants.find({ borough: "Bronx" })
      .skip(5)
      .limit(5)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (error) {
    console.log(error);
  }
});

// 8. Write a MongoDB query to find the restaurants who achieved a score more than 90.
router.get("/score-data", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      grades: { $elemMatch: { score: { $gt: 90 } } },
    });

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 9. Write a MongoDB query to find the restaurants that achieved a score, more than 80 but less than 100.
router.get("/filter-between-two-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      grades: { $elemMatch: { score: { $gt: 80, $lt: 100 } } },
    });

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 10. Write a MongoDB query to find the restaurants which locate in latitude value less than -95.754168
router.get("/latitude-value", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      "address.coord": { $lt: -95.754168 },
    });

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 11. Write a MongoDB query to find the restaurants that do not prepare any cuisine of 'American' and their grade score more than 70 and latitude less than -65.754168.
router.get("/multiple-filter-with-three-value", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { cuisine: { $ne: "American" } },
        { "grades.score": { $gt: 70 } },
        { "address.coord": { $lt: -65.754168 } },
      ],
    });
    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 12. Write a MongoDB query to find the restaurants which do not prepare any cuisine of 'American' and achieved a score more than 70 and located in the longitude less than -65.754168.
// Note : Do this query without using $and operator.
router.get("/without-and-operator-multiple-filter", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      cuisine: { $ne: "American" },
      "grades.score": { $gt: 70 },
      "address.coord": { $lt: -65.754168 },
    });
    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 13. Write a MongoDB query to find the restaurants which do not prepare any cuisine of 'American' and achieved a grade point 'A' not belongs to the borough Brooklyn. The document must be displayed according to the cuisine in descending order.
router.get("/same-multiple-filter", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { cuisine: { $ne: "American" } },
        { "grades.grade": { $eq: "A" } },
        { borough: { $ne: "Brooklyn" } },
      ],
    }).sort({ cuisine: -1 });

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 14. Write a MongoDB query to find the restaurant_Id, name, borough and cuisine for those restaurants which contain 'Wil' as first three letters for its name.
router.get("/letter-depend-filter", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      { name: /^Wil/ },
      {
        restaurant_id: 1,
        name: 1,
        borough: 1,
        cuisine: 1,
      }
    );
    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 15. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those restaurants which contain 'ces' as last three letters for its name.
router.get("/last-letter-filter", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      { name: /ces$/ },
      {
        restaurant_id: 1,
        name: 1,
        borough: 1,
        cuisine: 1,
      }
    );

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 16. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those restaurants which contain 'Reg' as three letters somewhere in its name.
router.get("/any-letter-filter", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      { name: /.*Reg*/ },
      {
        restaurant_id: 1,
        name: 1,
        borough: 1,
        cuisine: 1,
      }
    );

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 17. Write a MongoDB query to find the restaurants which belong to the borough Bronx and prepared either American or Chinese dish.
router.get("/or-and-query-both", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      borough: "Bronx",
      $or: [{ cuisine: { $eq: "American" } }, { cuisine: { $eq: "Chinese" } }],
    });

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 18. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those restaurants which belong to the borough Staten Island or Queens or Bronx or Brooklyn.
router.get("/or-method-use", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        borough: { $in: ["Staten Island", "Queens", "Bronx", "Brooklyn"] },
      },
      { restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
    );

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 19. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those restaurants which are not belonging to the borough Staten Island or Queens or Bronx or Brooklyn.
router.get("/not-in-method", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
   cuisine : {$nin : []} })
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
