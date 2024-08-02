import express from "express";
import bodyParser from "body-parser";
import 'dotenv/config'
import pg from 'pg';

const app = express();
const port = process.env.PORT_SERVER;

const db = new pg.Client({
  user: process.env.USER_DATABASE,
  host: process.env.HOST_DATABASE,
  database: process.env.NAME_DATABASE,
  password: process.env.PASS_DATABASE,
  port: process.env.PORT_DATABASE
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [{}];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC;");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
  
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  //items.push({ title: item });
  try {
    await db.query("INSERT INTO items (title) VALUES ($1);", [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});


app.post("/edit", async (req, res) => {
  //Cachar los valores que vienen de la petición(request).
  const updatedItemId = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle;
  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2;", [updatedItemTitle, updatedItemId]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
