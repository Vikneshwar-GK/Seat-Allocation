const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));



const User = require("../models/Student.js");

let year = 3;
let dept = "CSE";
let st_roll = 170701001;
let en_roll = 170701050;
let elective = "c1,c2";

for (let roll = st_roll; roll <= en_roll; roll++) {
    User.find({ roll: roll }, (err, result) => {
        if (result.length > 0) {
            console.log(result, " Already Exist!!");
        } else {
            const user = new User({
                dept: dept,
                year: year,
                roll: roll,
                elective: elective,
            });
            user.save().then((doc) => console.log("Added!!"))
                .catch((err) => console.log(err));
        }
    });


}
console.log("Task Complete!!");