var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

function generateRandomString(len) {
  var text = "";

  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}

function doesUserExist(receivedEmail){
  console.log('am i being fired??')
  for(const user in users){
    console.log('user here', users[user].email)
    if (users[user].email === receivedEmail){
      return true
    }
  }
}

function checkPassword(receivedEmail){
  for(const user in users){
    if(users[user].email === receivedEmail){
      console.log('yoo mah dude', users[user].password)
      return users[user].password
    }
  }
}


// console.log(generateRandomString(6))

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = {
  "userRandomID": {
    id: "userRandomID",
    email: 'user@example.com',
    password: "purple-monkey-dinosaur",
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
}

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
  let templateVars = {
    urls: urlDatabase,
    user_id: req.cookies.user_id,
    'users': users,
  };
  console.log(req.cookies.user_id)
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
  let templateVars = {
    shortURL: req.params.id,
    user_id: req.cookies.user_id,
    'users': users,
  };
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
})

app.get("/u/:shortURL", (req, res) => {
  let longURL = req.params.shortURL
  const url = urlDatabase[longURL]
  res.redirect(`urls${url}`);
});

app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user_id: req.cookies.user_id,
    'users': users,
  };
  res.render('register', templateVars)
})

app.post("/register", (req, res) => {
  const userID = generateRandomString(6)
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  if(!userEmail || !userPassword){
    res.send('error 400: must provide an email and password')
  } else if (doesUserExist(userEmail)){
    res.send('error 400: this email are exists')
  } else {
  users[userID] = {
    id: userID,
    email: userEmail,
    password: userPassword,
  }
  res.cookie('user_id', userID);
  console.log(users);
  res.redirect('/urls')
  }
})

app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user_id: req.cookies.user_id,
    'users': users,
  };
  res.render('login', templateVars)
})

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log('checking password in database', checkPassword(email))
  if(!doesUserExist(email)){
    res.send('error: email not registered')
  } else if (checkPassword(email) !== password) {
    res.send('error: password does not match with email')
  } else if (checkPassword(email) === password){
    for(const user in users){
      if(users[user].email === email){
        res.cookie('user_id', `${users[user].id}`);
        console.log('password retreived')
      }
    }
  }

  console.log('work?', req.cookies.user_id)
  res.redirect('/urls')
})

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect('/urls')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

