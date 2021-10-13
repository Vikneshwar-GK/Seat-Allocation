const express = require("express");
const router = express.Router();
const User = require("../models/StudInfo");
const Departments = require("../models/Department");

router.get("/view", (req, res) => {

    Departments.find({}, (err, result) => {
        let dept = [];
        res.render("modify_student_view", { deptname: result, dept: dept, layout: "loggedIn-layout" });
    });
});

router.get("/add", (req, res) => {
    Departments.find({}, (err, result) => {

        res.render("modify_student_add", { deptname: result, layout: "loggedIn-layout" });
    });
});

router.get("/addmore", (req, res) => {
    Departments.find({}, (err, result) => {

        res.render("modify_student_addMore", { deptname: result, layout: "loggedIn-layout" });
    });

});

router.get("/delete", (req, res) => {

    Departments.find({}, (err, result) => {

        res.render("modify_student_delete", { deptname: result, layout: "loggedIn-layout" });
    });

});

router.get("/deleteMore", (req, res) => {
    Departments.find({}, (err, result) => {

        res.render("modify_student_deleteMore", { deptname: result, layout: "loggedIn-layout" });
    });

});

router.get("/swap", (req, res) => {
    res.render("modify_student_swap");
});

router.post("/view", (req, res) => {
    let year = req.body.year;
    delete req.body.year;
    delete req.body.all;
    //delete req.body.dept;
    let dept = Object.keys(req.body);

    Departments.find({}, (err, result) => {

        //    res.render("modify_student_view", { deptname: result, layout: "loggedIn-layout" });
        let deptname = result;
        let deptstud = {};
        dept.forEach((dept) => {
            deptstud[dept] = [];
        });
        User.find({ dept: { "$in": dept }, year: year }, (err, result) => {

            result.forEach((element) => {
                deptstud[element.dept].push(element.roll);
            });
            dept.forEach((dept) => {
                // console.log(deptstud);
                deptstud[dept].sort();
                // console.log(deptstud);
            });
            //console.log(deptstud);
            res.render("modify_student_view", { deptname: deptname, dept: dept, deptstud: deptstud, year: year, layout: "loggedIn-layout" });
            //console.log(deptstud);
        });

    });

});

router.post("/add", (req, res) => {
    let year = req.body.year;
    year = parseInt(year);
    let dept = req.body.dept;
    let rolls = req.body.roll.split(",");
    rolls.forEach((roll) => {
        roll = parseInt(roll.trim());
        User.find({ year: year, dept: dept, roll: roll }, (err, result) => {
            if (result.length > 0) {
                console.log("Already Exist!!");
            } else {
                const user = new User({
                    dept: dept,
                    year: year,
                    roll: roll
                });
                user.save().then((doc) => console.log("Added!!"))
                    .catch((err) => console.log(err));
            }
        });



    });

    res.redirect("/examcell/modify/student/view");

});

router.post("/addmore", (req, res) => {
    let year = parseInt(req.body.year);
    let dept = req.body.dept;
    let st_roll = parseInt(req.body.st_roll);
    let en_roll = parseInt(req.body.en_roll);

    for (let roll = st_roll; roll <= en_roll; roll++) {
        User.find({ roll: roll }, (err, result) => {
            if (result.length > 0) {
                console.log(result, " Already Exist!!");
            } else {
                const user = new User({
                    dept: dept,
                    year: year,
                    roll: roll
                });
                user.save().then((doc) => console.log("Added!!"))
                    .catch((err) => console.log(err));
            }
        });


    }
    res.redirect("/examcell/modify/student/view");

});

router.post("/delete", (req, res) => {
    let year = req.body.year;
    year = parseInt(year);
    let dept = req.body.dept;
    let rolls = req.body.roll.split(",");
    rolls.forEach((roll) => {
        roll = parseInt(roll.trim());
        User.findOneAndDelete({ year: year, dept: dept, roll: roll }, (err, doc) => {
            console.log("Student record deleted");
        });



    });

    res.redirect("/examcell/modify/student/view");
});

router.post("/deleteMore", (req, res) => {
    console.log(req.body);
    let year = req.body.year;
    delete req.body.year;
    delete req.body.all;
    let dept = Object.keys(req.body);

    User.deleteMany({ year: year, dept: { "$in": dept } }, (err, doc) => {
        console.log("Deleted");

    });
    res.redirect("/examcell/modify/student/view");




});

router.post("/swap", (req, res) => {
    User.deleteMany({ year: 4 }, (err, doc) => {
        console.log("Deleted");

    });
    res.redirect("/examcell/modify/student/view");
});

module.exports = router;