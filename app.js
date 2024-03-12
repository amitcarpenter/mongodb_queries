require("./config/database");

require("dotenv").config();
const express = require("express");
const router = require("./mongodbQueries");
port = process.env.PORT;
const app = express();

app.use("/", router);


app.get("/", (req,res)=>{
  res.send("<h1>MongoDB Query</h1>")
})

app.listen(port, () => {
  console.log(`server is running on the http://localhost:${port}`);
});
