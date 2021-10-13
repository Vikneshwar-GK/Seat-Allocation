const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const BlockName = require("../models/BlockName");
const BlockDetails = require("../models/BlockDetails");
const Departments = require("../models/Department");

router.get("/view", (req, res) => {

    Departments.find({}, (err, result) => {
        let deptname = [];
        for (let i = 0; i < result.length; i++) {
            deptname.push(result[i].dept);
        }
        res.render("modify_dept_view", { deptname: deptname, layout: "loggedIn-layout" });
    });



});

router.get("/add", (req, res) => {

    res.render("modify_dept_add", { layout: "loggedIn-layout" });


});

router.get("/delete", (req, res) => {

    Departments.find({}, (err, result) => {
        let deptname = [];
        for (let i = 0; i < result.length; i++) {
            deptname.push(result[i].dept);
        }
        //
        res.render("modify_dept_delete", { deptname: deptname, layout: "loggedIn-layout" });
    });

});

router.post("/add", (req, res) => {
    let dept = req.body.dept;
    dept = dept.split(",");
    //console.log(sem, dept, subj);

    dept.forEach(element => {
        element = element.trim();
        element = element.toUpperCase();
        Departments.find({ dept: element }, (err, doc) => {
            if (doc.length > 0) {
                console.log("already exist!!");
                // popup.alert({
                //     content: 'Already Exist!!'
                // });
                //alert("Already exist");
            } else {
                const user = new Departments({
                    dept: element,
                });
                user.save().then((doc) => console.log("Added!!"))
                    .catch((err) => console.log(err));
            }
        });
    });
    res.redirect("/examcell/modify/dept/view");
});

router.post("/delete", (req, res) => {
    //BlockName.findOneAndDelete({ blockId : re})
    //console.log("**///////////");

    let key = Object.keys(req.body);
    //console.log(key);
    key.forEach((dept) => {
        Departments.findOneAndDelete({ dept: dept }, (err, doc) => {
            console.log("Dept Deleted");
        });
    })


    res.redirect("/examcell/modify/dept/view");
});

module.exports = router;