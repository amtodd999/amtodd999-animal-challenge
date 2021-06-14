const express = require("express");
const app = express();
const db = require("./db");

const controllers = require("./controllers");

app.use(require("./middleware/headers"));

app.use(express.json());

app.use("/user", controllers.usercontroller);
app.use("/animal", controllers.animalcontroller);

db.authenticate()
  .then(() => db.sync()) // => {force: true}
  .then(() => {
    app.listen(3000, () =>
      console.log(`[Server: ] App is listening on Port ${3000}`)
    );
  })
  .catch((err) => {
    console.log("[Server: ] Server Crashed");
    console.error(err);
  });
