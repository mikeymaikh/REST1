const fs = require("fs");
const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS asetukset

app.use(function (req, res, next) {
  // Website you wish to allow to connect

  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)

  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-type", "application/json");

  next();
});
//end CORS

app.post("/", function (req, res) {
  const fi = req.query.fi;
  const en = req.query.en;

  if (fi && en) {
    try {
      fs.appendFileSync("./sanakirja.txt",\n${fi} ${en});
    } catch (err) {
      res.sendStatus(500);
    }
    res.status(201).send('${fi} ${en}');
  } else {
    res.sendStatus(400);
  }
});

app.get("/", function (req, res) {
  const sana = req.query.sana;

  try {
    const data = fs.readFileSync("./sanakirja.txt", "utf8");
    const sanat = data.split("\n").map((str) => {
      const [fi, en] = str.split(" ");

      return { fi, en };
    });
    if (sana) {
      const tulos = sanat.find((s) => s.fi === sana);
      if (tulos) {
        res.status(200).send(tulos);
      }
    } else {
      res.status(200).send(sanat);
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, function () {
  console.log(Server is listening on port ${port});
});