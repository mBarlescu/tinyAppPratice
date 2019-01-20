var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString(len) {
  var text = "";

  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}
// console.log(generateRandomString(6))

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
console.log(urlDatabase)

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars)
})

app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString(6)
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`http://localhost:8080/u/${shortURL}`);
})

app.get("/urls/new", (req, res) => {
  res.render("urls_new")
})

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
})

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id]
  res.redirect("/urls")
})

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  urlDatabase[id] = req.body.newLongURL;
  console.log('dude', urlDatabase);
  res.redirect('/urls');
  // console
})

app.get("/u/:shortURL", (req, res) => {
  let longURL = req.params.shortURL
  const url = urlDatabase[longURL]
  res.redirect(`urls${url}`);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

