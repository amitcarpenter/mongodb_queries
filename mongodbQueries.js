const { count } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Restaurants = mongoose.model("restaurant", {});
const Instruments = mongoose.model("instrument", {});
const InstrumentKeys = require("./models/instrumentKeys");

const router = express.Router();

router.use(bodyParser.json());
router.use(express.json());

function ISODate(isoString) {
  return new Date(isoString);
}

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
      cuisine: { $nin: [] },
    });
  } catch (error) {
    console.log(error);
  }
});

// 20. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those restaurants which achieved a score which is not more than 10.
router.get("/not-more-then", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      { "grades.score": { $not: { $gt: 10 } } },
      { restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
    );
    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 21. Write a MongoDB query to find the restaurant Id, name, borough and cuisine for those restaurants which prepared dish except 'American' and 'Chinees' or restaurant's name begins with letter 'Wil'.
router.get("/or-filter", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        $or: [
          { name: /^Wil/ },
          {
            $and: [
              { cuisine: { $ne: "American" } },
              { cuisine: { $ne: "Chinees" } },
            ],
          },
        ],
      },
      { restaurant_id: 1, name: 1, cuisine: 1, borough: 1 }
    );

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 22. Write a MongoDB query to find the restaurant Id, name, and grades for those restaurants which achieved a grade of "A" and scored 11 on an ISODate "2014-08-11T00:00:00Z" among many of survey dates..
router.get("/iso-data-and-filter", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        "grades.date": ISODate("2014-08-11T00:00:00Z"),
        "grades.grade": "A",
        "grades.score": 11,
      },
      { restaurant_id: 1, name: 1, grades: 1 }
    );

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 23. Write a MongoDB query to find the restaurant Id, name and grades for those restaurants where the 2nd element of grades array contains a grade of "A" and score 9 on an ISODate "2014-08-11T00:00:00Z".
router.get("/second-element-of-the-grade", async (req, res) => {
  try {
    const targetDate = new Date("2014-08-11T00:00:00Z");
    const restaurants_data = await Restaurants.find(
      {
        "grades.1.date": ISODate("2014-08-11T00:00:00Z"),
        "grades.1.grade": "A",
        "grades.1.score": 9,
      },
      { restaurant_id: 1, name: 1, grades: 1 }
    );

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 24. Write a MongoDB query to find the restaurant Id, name, address and geographical location for those restaurants where 2nd element of coord array contains a value which is more than 42 and upto 52.
router.get("/get-second-element-based-filter", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      { "address.coord.1": { $gt: 42, $lt: 52 } },
      { restaurant_id: 1, name: 1, address: 1, coord: 1 }
    );

    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 25. Write a MongoDB query to arrange the name of the restaurants in ascending order along with all the columns.
router.get("/ascending-order-name", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find().sort({ name: 1 });
    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 26. Write a MongoDB query to arrange the name of the restaurants in descending along with all the columns.
router.get("/descending-order-name", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find().sort({ name: -1 });
    res.send(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 27. Write a MongoDB query to arranged the name of the cuisine in ascending order and for that same cuisine borough should be in descending order.
router.get("/ascending-and-descending-on-cuisine", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find().sort({
      cuisine: 1,
      borough: -1,
    });
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 28. Write a MongoDB query to know whether all the addresses contains the street or not.
router.get("/contains-street-or-not", (req, res) => {
  try {
    Restaurants.find({ "address.street": { $exists: true } })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
});

// 29. Write a MongoDB query which will select all documents in the restaurants collection where the coord field value is Double.
router.get("/coord-field-double", (req, res) => {
  try {
    Restaurants.find({ "address.coord": { $type: 1 } })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        console.log;
      });
  } catch (error) {
    console.log(error);
  }
});

// 30. Write a MongoDB query which will select the restaurant Id, name and grades for those restaurants which returns 0 as a remainder after dividing the score by 7.
router.get("/divide-method", (req, res) => {
  try {
    Restaurants.find(
      { "grades.score": { $mod: [7, 0] } },
      { restaurant_id: 1, name: 1, grades: 1 }
    )
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json(error);
      });
  } catch (error) {
    console.log(error);
  }
});

// 31. Write a MongoDB query to find the restaurant name, borough, longitude and attitude and cuisine for those restaurants which contains 'mon' as three letters somewhere in its name.
router.get("/restaurent-name-contains-mon", (req, res) => {
  try {
    Restaurants.find(
      { name: { $regex: "mon.*", $options: "i" } },
      { "address.coord": 1, name: 1, cuisine: 1, borough: 1 }
    )
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json(error);
      });
  } catch (error) {
    res.json(error);
  }
});

// 32. Write a MongoDB query to find the restaurant name, borough, longitude and latitude and cuisine for those restaurants which contain 'Mad' as first three letters of its name.
router.get("/first-contains-letters", (req, res) => {
  try {
    Restaurants.find(
      { name: { $regex: /^Mad/i } },
      { name: 1, "address.coord": 1, borough: 1, cuisine: 1 }
    )
      .then(function (data) {
        res.json(data);
      })
      .catch(function (err) {
        res.json(err);
      });
  } catch (error) {
    console.log(error);
  }
});

// 33. Write a MongoDB query to find the restaurants that have at least one grade with a score of less than 5.
router.get("/less-then-five-query", (req, res) => {
  try {
    Restaurants.find({ "grades.score": { $lt: 5 } })
      .then(function (data) {
        res.json(data);
      })
      .catch((error) => {
        res.json(error);
      });
  } catch (error) {
    console.log(error);
  }
});

// 34. Write a MongoDB query to find the restaurants that have at least one grade with a score of less than 5 and that are located in the borough of Manhattan.
router.get("/score-and-location-filter", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      "grades.score": { $lt: 5 },
      borough: "Manhattan",
    });
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 35. Write a MongoDB query to find the restaurants that have at least one grade with a score of less than 5 and that are located in the borough of Manhattan or Brooklyn.
router.get("/score-and-two-or-location", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { "grades.score": { $lt: 5 } },
        { $or: [{ borough: "Manhattan" }, { borough: "Brooklyn" }] },
      ],
    });

    res.json(restaurants_data);
  } catch (error) {
    res.json(error);
  }
});

// 36. Write a MongoDB query to find the restaurants that have at least one grade with a score of less than 5 and that are located in the borough of Manhattan or Brooklyn, and their cuisine is not American.
router.get("/filter-location-score-cuision", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { "grades.score": { $lt: 5 } },
        { $or: [{ borough: "Manhattan" }, { borough: "Brooklyn" }] },
        { cuisine: { $ne: "American" } },
      ],
    });

    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 37. Write a MongoDB query to find the restaurants that have at least one grade with a score of less than 5 and that are located in the borough of Manhattan or Brooklyn, and their cuisine is not American or Chinese.
router.get("/filter-location-score-cuision-and-or", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        {
          $or: [{ borough: "Manhattan" }, { borough: "Brooklyn" }],
        },
        {
          $nor: [{ cuisine: "American" }, { cuisine: "Chinese" }],
        },
        {
          grades: {
            $elemMatch: {
              score: { $lt: 5 },
            },
          },
        },
      ],
    });
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 38. Write a MongoDB query to find the restaurants that have a grade with a score of 2 and a grade with a score of 6.
router.get("/score-and-filter", (req, res) => {
  try {
    Restaurants.find({ $and: [{ "grades.score": 2 }, { "grades.score": 6 }] })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json(error);
      });
  } catch (error) {
    console.log(error);
  }
});

// 39. Write a MongoDB query to find the restaurants that have a grade with a score of 2 and a grade with a score of 6 and are located in the borough of Manhattan.
router.get("/score-and-filter-and-location", (req, res) => {
  try {
    Restaurants.find({
      $and: [
        { "grades.score": 2 },
        { "grades.score": 6 },
        { borough: "Manhattan" },
      ],
    })
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.json(error);
      });
  } catch (error) {
    console.log(error);
  }
});

// 40. Write a MongoDB query to find the restaurants that have a grade with a score of 2 and a grade with a score of 6 and are located in the borough of Manhattan or Brooklyn.
router.get("/and-or-with-score-location", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { "grades.score": { $eq: 2 } },
        { "grades.score": { $eq: 6 } },
        { borough: { $in: ["Manhattan", "Brooklyn"] } },
      ],
    });

    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 41. Write a MongoDB query to find the restaurants that have a grade with a score of 2 and a grade with a score of 6 and are located in the borough of Manhattan or Brooklyn, and their cuisine is not American.
router.get("/multiple-filter-apply", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { borough: { $in: ["Manhattan", "Brooklyn"] } },
        { "grades.score": { $all: [2, 6] } },
        { cuisine: { $ne: "American" } },
      ],
    });
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 42. Write a MongoDB query to find the restaurants that have a grade with a score of 2 and a grade with a score of 6 and are located in the borough of Manhattan or Brooklyn, and their cuisine is not American or Chinese.
router.get("/add-one-more-query", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { borough: { $in: ["Manhattan", "Brooklyn"] } },
        { cuisine: { $nin: ["American", "Chinese"] } },
        { grades: { $elemMatch: { score: 2 } } },
        { grades: { $elemMatch: { score: 6 } } },
      ],
    });

    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 43. Write a MongoDB query to find the restaurants that have a grade with a score of 2 or a grade with a score of 6.
router.get("/only-for-grades-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $or: [{ "grades.score": 2 }, { "grades.score": 6 }],
    });
    res.json(restaurants_data);
  } catch (err) {
    res.json(err);
  }
});

// 44. Write a MongoDB query to find the restaurants that have a grade with a score of 2 or a grade with a score of 6 and are located in the borough of Manhattan.
router.get("/and-in-or-method", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { $or: [{ "grades.score": 2 }, { "grades.score": 6 }] },
        { borough: "Manhattan" },
      ],
    });
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 45. Write a MongoDB query to find the restaurants that have a grade with a score of 2 or a grade with a score of 6 and are located in the borough of Manhattan or Brooklyn.
router.get("/double-or-method-and", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { $or: [{ "grades.score": 2 }, { "grades.score": 6 }] },
        { $or: [{ borough: "Manhattan" }, { borough: "Brooklyn" }] },
      ],
    });
    res.json(restaurants_data);
  } catch (err) {
    res.json(err);
  }
});

// 46. Write a MongoDB query to find the restaurants that have a grade with a score of 2 or a grade with a score of 6 and are located in the borough of Manhattan or Brooklyn, and their cuisine is not American.
router.get("/and-or-not", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { $or: [{ "grades.score": 2 }, { "grades.score": 6 }] },
        { $or: [{ borough: "Manhattan" }, { borough: "Brooklyn" }] },
        { cuisine: { $ne: "American" } },
      ],
    });

    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 47. Write a MongoDB query to find the restaurants that have a grade with a score of 2 or a grade with a score of 6 and are located in the borough of Manhattan or Brooklyn, and their cuisine is not American or Chinese.
router.get("/and-or-nin", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { $or: [{ "grades.score": 2 }, { "grades.score": 6 }] },
        { $or: [{ borough: "Manhattan" }, { borough: "Brooklyn" }] },
        { cuisine: { $nin: ["American", "Chinese"] } },
      ],
    });

    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 48. Write a MongoDB query to find the restaurants that have all grades with a score greater than 5.
router.get("/greater-then-five", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      grades: {
        $not: {
          $elemMatch: {
            score: {
              $lte: 5,
            },
          },
        },
      },
    });

    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 49. Write a MongoDB query to find the restaurants that have all grades with a score greater than 5 and are located in the borough of Manhattan.
router.get("/not-elementMatch-and-lte", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        { grades: { $not: { $elemMatch: { score: { $lte: 5 } } } } },
        { borough: "Manhattan" },
      ],
    });

    res.json(restaurants_data);
  } catch (error) {
    res.json(error);
  }
});

// 50. Write a MongoDB query to find the restaurants that have all grades with a score greater than 5 and are located in the borough of Manhattan or Brooklyn.
router.get("/and-or-not-elemMatch", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      $and: [
        {
          grades: {
            $not: {
              $elemMatch: {
                score: {
                  $lte: 5,
                },
              },
            },
          },
        },
        {
          $or: [{ borough: "Manhattan" }, { borough: "Brooklyn" }],
        },
      ],
    });

    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
