// imports together
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const authRouter = require("./routers/authRouter");

// config vars
const PORT = process.env.PORT || 9000;

// instantiating
const prisma = new PrismaClient();
var app = express();

// loading middlewares into express (app.use)
app.use(bodyParser.json());
//what is it doing here, html form url encoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(authRouter);

function isSessionExpired(dateObject) {
  return dateObject <= +new Date();
}

app.get("/welcome", async (req, res) => {
  if (!req.cookies.session_token) {
    return res.redirect("/login");
  }

  const session = await prisma.session.findFirst({
    where: {
      token: req.cookies["session_token"],
    },
  });

  if (!session) {
    return res.redirect("/login");
  }

  if (isSessionExpired(session.expiry)) {
    res.redirect("/login");

    const deletedUserToken = await prisma.session.delete({
      where: {
        id: session.id,
      },
    });
    return console.log(deletedUserToken);
  }

  res.send(`Welcome ${session.email}!`).end();
});

app.get("/profile", async (req, res) => {
  if (!req.cookies.session_token) {
    return res.redirect("/login");
  }

  const session = await prisma.session.findFirst({
    where: {
      token: req.cookies["session_token"],
    },
  });

  if (!session) {
    return res.redirect("/login");
  }

  if (isSessionExpired(session.expiry)) {
    res.redirect("/login");

    const deletedUserToken = await prisma.session.delete({
      where: {
        id: session.id,
      },
    });
    return console.log(deletedUserToken);
  }

  res.send(`Here is your profile`).end();
});

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
