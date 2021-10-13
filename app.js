const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();

// Passport Config
require("./config/passport")(passport);

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

app.locals.settings.semester = 0;
app.locals.settings.seatingOption = 0;
app.locals.settings.depList = [];
app.locals.settings.blockList = [];
app.locals.settings.roomInfo = [];

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
app.set("some", "value");
//console.log(app.get("some"));
// Global variables
app.use(function(req, res, next) {
    //console.log(app.get("some"));
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

app.use(express.static(__dirname + "/public"));

// Routes
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));
app.use("/examcell/create", require("./routes/createPlan.js"));
app.use("/examcell/create/plan2", require("./routes/createPlan2.js"));
app.use("/dashboard/addDetails", require("./routes/addDetails.js"));
app.use("/examcell/modify", require("./routes/modify_home.js"));
app.use("/examcell/modify/block", require("./routes/modify_block.js"));
app.use("/examcell/modify/room", require("./routes/modify_room.js"));
app.use("/examcell/modify/dept", require("./routes/modify_dept.js"));
app.use("/examcell/modify/deptsub", require("./routes/modify_deptsub.js"));
app.use("/examcell/modify/student", require("./routes/modify_student.js"));
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));