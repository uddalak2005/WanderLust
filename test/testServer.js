const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const path = require("path");
const session = require("express-session");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(session({
    secret: "Yw2rf6Am3t0/M2odbWJ/4ReSYv1g62dYro+nlmDpt4A=",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(cookieParser("L81kbz1MGxk+93efFvwcVd1GdgqilRvt"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    return res.send(`You visited the site ${req.session.count} times`);
})

app.get("/getcookie", (req, res) => {
    res.cookie("made-In", "India");
    res.cookie("signedCookie", "Hello World", { signed: true });
    return res.send("Here is your cookie");
})

app.get("/showcookie", (req, res) => {
    console.log(req.cookies);
    console.log(req.signedCookies);
    res.send(`Your cookie is ${JSON.stringify(req.cookies)}<br>And your signed cookie is ${JSON.stringify(req.signedCookies)}`);
})

app.get("/register", (req, res) => {
    const { name = "anoynymous" } = req.query;
    console.log(name);
    if (name === "anoynymous") {
        req.flash("error", "User not registered");
    } else {
        req.flash("success", "User registered");
    }
    req.session.name = name;
    res.redirect("/greet");
})

app.get("/greet", (req, res) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.render("show.ejs", {
        name : req.session.name,
    });
})


app.listen(8000, () => {
    console.log(`Test Server listening on port 8000`);
})