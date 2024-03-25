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

// 51. Write a MongoDB query to find the average score for each restaurant.
router.get("/average-score-of-restaurant", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $group: {
          _id: "$restaurant_id",
          avgScore: {
            $avg: "$grades.score",
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 52. Write a MongoDB query to find the highest score for each restaurant.
router.get("/get-highest-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $group: {
          _id: "$name",
          HighestScore: {
            $max: "$grades.score",
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

//53. Write a MongoDB query to find the lowest score for each restaurant.
router.get("/get-lowest-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $group: {
          _id: "$name",
          minimum_score: {
            $min: "$grades.score",
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 54. Write a MongoDB query to find the count of restaurants in each borough.
router.get("/get-score-by-borough", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $group: {
          _id: "$borough",
          borough_count: {
            $sum: 1,
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 55. Write a MongoDB query to find the count of restaurants for each cuisine.
router.get("/get-count-of-cuisine", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $group: {
          _id: "$cuisine",
          cuisine_count: {
            $sum: 1,
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 56. Write a MongoDB query to find the count of restaurants for each cuisine and borough.
router.get("/get-count-of-cuisine-and-borough", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $group: {
          _id: {
            cuisine: "$cuisine",
            borough: "$borough",
          },
          both_count: {
            $sum: 1,
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 57. Write a MongoDB query to find the count of restaurants that received a grade of 'A' for each cuisine.
router.get("/get-matched-score-of-restaurant", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $match: { "grades.grade": "A" },
      },
      {
        $group: {
          _id: "$cuisine",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 58. Write a MongoDB query to find the count of restaurants that received a grade of 'A' for each borough.
router.get("/get-count-of-grade-borough", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $match: { "grades.grade": "A" },
      },
      {
        $group: {
          _id: "$borough",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 59. Write a MongoDB query to find the count of restaurants that received a grade of 'A' for each cuisine and borough.
router.get("/get-count-for-both-cuisine-borough", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $match: { "grades.grade": "A" },
      },
      {
        $group: {
          _id: {
            borough: "$borough",
            cuisine: "$cuisine",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 60. Write a MongoDB query to find the number of restaurants that have been graded in each month of the year.
router.get("/get-data-by-project-in-aggregate", async (req, res) => {
  const restaurants_data = await Restaurants.aggregate([
    {
      $unwind: "$grades",
    },
    {
      $project: {
        month: { $month: { $toDate: "$grades.date" } },
        year: { $year: { $toDate: "$grades.date" } },
      },
    },
    {
      $group: {
        _id: {
          year: "$year",
          month: "$month",
        },
        number: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);

  console.log(restaurants_data);
  res.json(restaurants_data);
});

//61. Write a MongoDB query to find the average score for each cuisine.
router.get("/get-ave-of-cuisine", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $group: {
          _id: "$cuisine",
          avgScore: {
            $avg: "$grades.score",
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    res.json(error);
  }
});

//62. Write a MongoDB query to find the highest score for each cuisine.
router.get("/get-highest-score-of-each-cuisine", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $group: {
          _id: "$cuisine",
          HighestScore: {
            $max: "$grades.score",
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 63. Write a MongoDB query to find the lowest score for each cuisine.
router.get("/get-lowest-score-of-each-cuisine", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $group: {
          _id: "$cuisine",
          minimum_score: {
            $min: "$grades.score",
          },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 64. Write a MongoDB query to find the average score for each borough.
router.get("/get-average-score-of-each-borough", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $group: {
          _id: "$borough",
          avgScore: {
            $avg: "$grades.score",
          },
        },
      },
    ]);
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 65. Write a MongoDB query to find the highest score for each borough.
router.get("/get-higest-score-of-each-borough", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $group: {
          _id: "$borough",
          HighestScore: {
            $max: "$grades.score",
          },
        },
      },
    ]);
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 66. Write a MongoDB query to find the lowest score for each borough.
router.get("/get-lowest-score-of-each-borough", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $group: {
          _id: "$borough",
          minimum_score: {
            $min: "$grades.score",
          },
        },
      },
    ]);
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 67. Write a MongoDB query to find the name and address of the restaurants that received a grade of 'A' on a specific date.
router.get("/get-find-query-start", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        grades: {
          $elemMatch: {
            date: {
              $eq: ISODate("2013-07-22T00:00:00Z"),
            },
            grade: {
              $eq: "A",
            },
          },
        },
      },
      {
        name: 1,
        address: 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 68. Write a MongoDB query to find the name and address of the restaurants that received a grade of 'B' or 'C' on a specific date.
router.get("/get-find-query-start-2", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        grades: {
          $elemMatch: {
            date: {
              $eq: ISODate("2013-07-22T00:00:00Z"),
            },
            grade: {
              $in: ["B", "C"],
            },
          },
        },
      },
      {
        name: 1,
        address: 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 69. Write a MongoDB query to find the name and address of the restaurants that have at least one 'A' grade and one 'B' grade.
router.get("/get-find-query-start-2", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        $and: [{ "grades.grade": "A" }, { "grades.grade": "B" }],
      },
      {
        name: 1,
        address: 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 70. Write a MongoDB query to find the name and address of the restaurants that have at least one 'A' grade and no 'B' grades.
router.get("/get-find-query-start-3", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        $and: [{ "grades.grade": "A" }, { "grades.grade": { $ne: "B" } }],
      },
      {
        name: 1,
        address: 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 71. Write a MongoDB query to find the name ,address and grades of the restaurants that have at least one 'A' grade and no 'C' grades.
router.get("/get-find-query-start-4", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        $and: [{ "grades.grade": "A" }, { "grades.grade": { $ne: "C" } }],
      },
      {
        name: 1,
        address: 1,
        "grades.grade": 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 72. Write a MongoDB query to find the name, address, and grades of the restaurants that have at least one 'A' grade, no 'B' grades, and no 'C' grades.
router.get("/get-find-query-start-5", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        $and: [
          { "grades.grade": "A" },
          { "grades.grade": { $ne: "B" } },
          { "grades.grade": { $ne: "C" } },
        ],
      },
      {
        name: 1,
        address: 1,
        "grades.grade": 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 73. Write a MongoDB query to find the name and address of the restaurants that have the word 'coffee' in their name.
router.get("/get-find-query-start-6", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        name: { $regex: /coffee/i },
      },
      {
        name: 1,
        address: 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 74. Write a MongoDB query to find the name and address of the restaurants that have a zipcode that starts with '10'.
router.get("/get-find-query-start-7", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      {
        "address.zipcode": /^10/,
      },
      {
        name: 1,
        address: 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 75. Write a MongoDB query to find the name and address of the restaurants that have a cuisine that starts with the letter 'B'.
router.get("/get-find-query-start-8", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      { cuisine: { $regex: /^B/ } },
      {
        name: 1,
        address: 1,
        cuisine: 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 76. Write a MongoDB query to find the name, address, and cuisine of the restaurants that have a cuisine that ends with the letter 'y'.
router.get("/get-find-query-start-9", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      { cuisine: { $regex: /y$/i } },
      {
        name: 1,
        address: 1,
        cuisine: 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 77. Write a MongoDB query to find the name, address, and cuisine of the restaurants that have a cuisine that contains the word 'Pizza'.
router.get("/get-find-query-start-10", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find(
      { cuisine: { $regex: /Pizza/i } },
      {
        name: 1,
        address: 1,
        cuisine: 1,
        _id: 0,
      }
    );
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 78. Write a MongoDB query to find the restaurants achieved highest average score.
router.get("/get-highest-average-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $group: {
          _id: "$restaurant_id",
          avgScore: {
            $avg: "$grades.score",
          },
        },
      },
      { $sort: { avgScore: -1 } },
      { $limit: 1 },
    ]);
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 79. Write a MongoDB query to find all the restaurants with the highest number of "A" grades.
router.get("/get-highest-number-a", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $match: {
          "grades.grade": "A",
        },
      },
      {
        $group: {
          _id: "$restaurant_id",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $group: {
          _id: "$count",
          restaurant: {
            $push: "$_id",
          },
        },
      },
      {
        $sort: { _id: -1 },
      },
      { $limit: 1 },
    ]);
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 80. Write a MongoDB query to find the cuisine type that is most likely to receive a "C" grade
router.get("/get-highest-number-a-1", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $unwind: "$grades",
      },
      {
        $match: {
          "grades.grade": "C",
        },
      },
      {
        $group: {
          _id: "$cuisine",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 81. Write a MongoDB query to find the restaurant that has the highest average score for the cuisine "Turkish".
router.get("/get-highest-avg-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      { $match: { cuisine: "Turkish" } },
      { $unwind: "$grades" },
      {
        $group: {
          _id: "$name",
          avgScore: { $avg: "$grades.score" },
        },
      },
      { $sort: { avgScore: -1 } },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 82. Write a MongoDB query to find the restaurants that achieved the highest total score.
router.get("/get-highest-achived-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      { $unwind: "$grades" },
      {
        $group: {
          _id: "$name",
          highestScore: {
            $sum: "$grades.score",
          },
        },
      },
      {
        $sort: {
          highestScore: -1,
        },
      },
      {
        $group: {
          _id: "$highestScore",
          restaurant: { $push: "$_id" },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      { $limit: 1 },
      {
        $group: {
          _id: "$_id",
          final: {
            $push: "$restaurant",
          },
        },
      },
      {
        $sort: {
          final: -1,
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 83. Write a MongoDB query to find all the Chinese restaurants in Brooklyn.
router.get("/get-highest-achived-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.find({
      borough: "Brooklyn",
      cuisine: "Chinese",
    });

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 84. Write a MongoDB query to find the restaurant with the most recent grade date.
router.get("/get-highest-achived-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      { $unwind: "$grades" },
      { $sort: { "grades.date": -1 } },
      { $limit: 1 },
      { $project: { name: 1, "grades.date": 1, _id: 0 } },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 85. Write a MongoDB query to find the top 5 restaurants with the highest average score for each cuisine type, along with their average scores.
router.get("/get-highest-achived-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      { $unwind: "$grades" },
      {
        $group: {
          _id: { cuisine: "$cuisine", restaurant_id: "$restaurant_id" },
          avgScore: { $avg: "$grades.score" },
        },
      },
      {
        $sort: {
          "_id.cuisine": 1,
          avgScore: -1,
        },
      },
      {
        $group: {
          _id: "$_id.cuisine",
          topRestaurants: {
            $push: {
              restaurant_id: "$_id.restaurant_id",
              avgScore: "$avgScore",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          cuisine: "$_id",
          topRestaurants: { $slice: ["$topRestaurants", 5] },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 86. Write a MongoDB query to find the top 5 restaurants in each borough with the highest number of "A" grades.
router.get("/get-highest-achived-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      { $unwind: "$grades" },
      { $match: { "grades.grade": "A" } },
      {
        $group: {
          _id: { borough: "$borough", restaurant_id: "$restaurant_id" },
          gradeCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.borough": 1,
          gradeCount: -1,
        },
      },
      {
        $group: {
          _id: "$_id.borough",
          topRestaurants: {
            $push: {
              restaurant_id: "$_id.restaurant_id",
              gradeCount: "$gradeCount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          borough: "$_id",
          topRestaurants: { $slice: ["$topRestaurants", 5] },
        },
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

// 87. Write a MongoDB query to find the borough with the highest number of restaurants that have a grade of "A" and a score greater than or equal to 90.
router.get("/get-highest-achived-score", async (req, res) => {
  try {
    const restaurants_data = await Restaurants.aggregate([
      {
        $match: {
          "grades.grade": "A",
          "grades.score": { $gte: 90 },
        },
      },
      {
        $group: {
          _id: "$borough",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    console.log(restaurants_data);
    res.json(restaurants_data);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
