const express = require("express");
const path = require("path");
// const __dirname = path.resolve();
const date = require("./day.js");
const _ = require("lodash");
let day = date();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

let app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoose = require("mongoose");
const e = require("express");

mongoose.connect(
  "mongodb+srv://admin-nfzj:gdsop321@cluster0.8jteo.mongodb.net/todoListDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your personal todolist!",
});

const item2 = new Item({
  name: "Hit the + button to add a new todo!",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item! Have fun!",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

//Home route - Display date as title.
app.get("/", (req, res) => {
  Item.find({}, (e, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {});
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Home", newItems: foundItems });
    }
  });
});

app.get("/:customList", (req, res) => {
  const customList = _.capitalize(req.params.customList);

  List.findOne({ name: customList }, (err, results) => {
    if (!err) {
      if (!results) {
        const list = new List({
          name: customList,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customList);
      } else {
        res.render("list", {
          listTitle: customList,
          newItems: results.items,
        });
      }
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  const item = new Item({
    name: req.body.newItem,
  });
  if (req.body.list === "Home") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: req.body.list }, (err, result) => {
      result.items.push(item);
      result.save();
      res.redirect("/" + req.body.list);
    });
  }
});

app.post("/delete", (req, res) => {
  const delItem = req.body.checkbox;
  if (req.body.list === "Home") {
    Item.deleteOne({ _id: delItem }, (e) => {});
    res.redirect("/");
  } else {
    List.findOne({ name: req.body.list }, (err, result) => {
      result.items.pull({ _id: delItem });
      result.save();
      res.redirect("/" + req.body.list);
    });
  }
});

app.listen(port, () => {
  console.log("server has started successfully");
});
