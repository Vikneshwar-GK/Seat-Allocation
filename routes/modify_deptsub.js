const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const BlockName = require("../models/BlockName");
const BlockDetails = require("../models/BlockDetails");
const Departments = require("../models/Department");
const DeptSub = require("../models/DeptSub");

router.get("/view", (req, res) => {
    let deptsub = [];
    Departments.find({}, (err, result) => {
        let deptname = ['ALL'];
        for (let i = 0; i < result.length; i++) {
            deptname.push(result[i].dept);
        }
        //
        res.render("modify_deptsub_view", { deptsub: deptsub, deptname: deptname, layout: "loggedIn-layout" });
    });

    //res.render("modify_deptsub_view", { layout: "loggedIn-layout" });




});

router.get("/add", (req, res) => {
    Departments.find({}, (err, result) => {


        //
        res.render("modify_deptsub_add", { deptname: result, layout: "loggedIn-layout" });
    });
    //res.render("modify_deptsub_add", { layout: "loggedIn-layout" });


});

router.get("/delete", (req, res) => {


    Departments.find({}, (err, result) => {


        //
        res.render("modify_deptsub_delete", { deptname: result, layout: "loggedIn-layout" });
    });








});





router.post("/view", (req, res) => {
    //console.log(req.body.semester, req.body.dept);
    let sem = req.body.semester;
    let dept = req.body.dept;
    Departments.find({}, (err, result) => {
        let deptname = ['ALL'];
        for (let i = 0; i < result.length; i++) {
            deptname.push(result[i].dept);
        }
        //
        if (sem == 'ALL' && dept != 'ALL') {
            DeptSub.find({ dept: dept }, (err, result) => {

                let deptsub = result;
                res.render("modify_deptsub_view", { deptsub: deptsub, deptname: deptname, layout: "loggedIn-layout" });

            });
        } else if (sem != 'ALL' && dept == 'ALL') {
            DeptSub.find({ sem: sem }, (err, result) => {

                let deptsub = result;
                res.render("modify_deptsub_view", { deptsub: deptsub, deptname: deptname, layout: "loggedIn-layout" });

            });
        } else if (sem == 'ALL' && dept == 'ALL') {
            DeptSub.find({}, (err, result) => {

                let deptsub = result;
                res.render("modify_deptsub_view", { deptsub: deptsub, deptname: deptname, layout: "loggedIn-layout" });

            });

        } else if (sem != 'ALL' && dept != 'ALL') {
            DeptSub.find({ sem: sem, dept: dept }, (err, result) => {

                let deptsub = result;
                res.render("modify_deptsub_view", { deptsub: deptsub, deptname: deptname, layout: "loggedIn-layout" });

            });

        }


        //res.render("modify_deptsub_view", { deptsub: deptsub, deptname: deptname, layout: "loggedIn-layout" });
    });


});

router.post("/add", (req, res) => {
    let sem = req.body.semester;
    let dept = req.body.dept;
    let subj = req.body.subj;
    subj = subj.split(",");
    //console.log(sem, dept, subj);

    subj.forEach(element => {
        element = element.trim();
        element = element.toLowerCase();

        DeptSub.find({ sem: sem, dept: dept, subj: element }, (err, doc) => {
            if (doc.length > 0) {
                console.log("already exist!!");

            } else {
                const user = new DeptSub({
                    sem: sem,
                    dept: dept,
                    subj: element
                });
                user.save().then((doc) => console.log("Added!!"))
                    .catch((err) => console.log(err));
            }
        });

    });
    res.redirect("/examcell/modify/deptsub/view");
});

router.post("/delete", (req, res) => {
    //console.log(req.body);

    let sem = req.body.semester;
    let dept = req.body.dept;
    let subj = req.body.subj;
    subj = subj.split(",");
    //console.log(sem, dept, subj);

    subj.forEach(element => {
        element = element.trim();
        element = element.toLowerCase();
        //console.log(element);
        DeptSub.findOneAndDelete({ sem: sem, dept: dept, subj: element }, (err, doc) => {
            console.log("Subj deleted");
        });


    });
    res.redirect("/examcell/modify/deptsub/view");



});



module.exports = router;