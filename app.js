const express = require("express");
const upload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 5000;

app.use(upload());

app.post("/get-word-count", (req, res) => {
  try {
    if (req.files && req.files.file) {
      if (req.files.file.mimetype === "text/plain") {
        let content = req.files.file.data.toString();
        content = content
          .replace(/\n|\r|\t/g, " ")
          .split(" ")
          .filter((word) => word);
        let obj = {};
        for (let word of content) {
          if (obj[`${word}`]) {
            obj[`${word}`] = obj[`${word}`] + 1;
          } else {
            obj[`${word}`] = 1;
          }
        }
        obj = Object.entries(obj)
          .sort(([, a], [, b]) => b - a)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        let arr = [];
        for (let key in obj) {
          if (arr.length < 10) {
            arr.push({ words: key, count: obj[key] });
          }
        }
        console.log(obj);
        console.log(arr);
        res.status(200).send(JSON.stringify(arr));
      } else {
        res.send("Invalid Format!");
      }
    } else {
      res.send("file required!");
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Something went wrong!");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
