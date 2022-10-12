const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

let sanakirja = [];

let data = fs.readFileSync("./sanakirja.txt", { encoding: "utf8", flag: "r" });

const splitLines = data.split(/\r?\n/);

splitLines.forEach((line) => {
  const sanat = line.split(" ");

  const sana = {
    fin: sanat[0],
    eng: sanat[1],
  };

  sanakirja.push(sana);
});

console.log(sanakirja);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );

  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-type", "application/json");
  next();
});


app.post("/sanakirja", (req, res) => {

  const sanapari = req.body;
  sanakirja.push(sanapari);

  try {
    data += `\n${sanapari.fin} ${sanapari.eng}`;
    fs.writeFileSync("./sanakirja.txt", data);
    return res.status(201).json(sanapari);
  } catch (error) {
    console.log(error);
    return res.status(500).json(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


//Luodaan haku parametriin

app.param("sana", function (req, res, next, sana) {
  const modified = sana.toLowerCase();
  req.sana = modified;
  next();
});

//Haetaan parametrinen tieto
app.get("/sanakirja/:sana", function(req, res) {

  const request = req.sana;
  const splitLines = data.split(/\r?\n/);

  splitLines.forEach((line) => {
    const sanat = line.split(" ");
    const finSana = {
      fin: sanat[0]
    };
    const engSana = {
      eng: sanat[1]
    };
    if (request == finSana.fin) {
      res.json(engSana.eng);
    }
  });
});