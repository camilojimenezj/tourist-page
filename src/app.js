const { urlencoded } = require("express");
const express = require("express");
const session = require("express-session");
const hbs = require("hbs");
const path = require("path");
const app = express();
const http = require("http");
require("./database");
const sockets = require("./sockets");

// settings
app.set("view engine", "hbs");
app.set("views", "src/views");
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.static(__dirname + "/public"));

// middlewares
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: false,
  })
);

// routes
app.use("/", require("./routes/index"));

// websockets
const server = http.createServer(app);
const httpServer = server.listen(3000, () => {
  console.log("\x1b[36m%s\x1b[0m", "\nConnected http://localhost:3000/\n");
});
const io = require("socket.io")(httpServer);
sockets(io);
