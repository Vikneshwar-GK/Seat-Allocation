const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const BlockDetails = require("../models/BlockDetails");
const BlockName = require("../models/BlockName");
const DeptSub = require("../models/DeptSub");
const Departments = require("../models/Department");

router.get("/plan1", (req, res) => {
    BlockName.find({}, (err, result) => {
        let blockname = [];
        for (let i = 0; i < result.length; i++) {
            blockname.push(result[i].blockId);
        }
        //console.log("Check!!");
        Departments.find({}, (err, result) => {
            // let deptname = [];
            // for (let i = 0; i < result.length; i++) {
            //     deptname.push(result[i].dept);
            // }
            res.render("createPlan1", { blockname: blockname, deptname: result, layout: "loggedIn-layout" });
        });
    });

});

const app = express();
// console.log(app.get("some"), "routes  bkjgkh");

router.post("/plan1", (req, res, next) => {
    let { semester } = req.body;
    const seatingOption = req.body["seating-option"];

    const body = req.body;
    delete body["semester"];
    delete body["seating-option"];

    //   console.log("OptionsArray");

    const optionsArr = Object.keys(body);
    //   console.log("body:", body);

    //   console.log(optionsArr);

    let depList = [];
    let blockList = [];
    optionsArr.map((ele) => {
        if (ele.startsWith("dep")) {
            depList.push(ele.slice(4));
        } else {
            blockList.push(ele.slice(6));
        }
    });
    let roomInfo = {};
    blockList.forEach((ele) => {
        roomInfo[ele] = [];
    });


    // blockList.forEach((b, i) => {
    // console.log(i, blockList);
    //console.log(depList);
    BlockDetails.find({
            blockId: { "$in": blockList }
        },
        (err, result) => {
            // console.log(result);
            for (let i = 0; i < result.length; i++) {
                let e = result[i];
                // console.log(e);
                roomInfo[e.blockId].push([e.roomNo, e.matrix]);

                // if (e.blockId === "A") {
                //     roomInfo.A.push([e.roomNo, e.matrix]);
                // } else if (e.blockId === "B") {
                //     roomInfo.B.push([e.roomNo, e.matrix]);
                //     // roomInfo.B[e.roomNo] = e.matrix;
                //     // roomInfo.B.push(e.roomNo);
                // } else if (e.blockId === "C") {
                //     //roomInfo.C[e.roomNo] = e.matrix;
                //     roomInfo.C.push([e.roomNo, e.matrix]);
                // } else if (e.blockId === "D") {
                //     //roomInfo.D[e.roomNo] = e.matrix;
                //     roomInfo.D.push([e.roomNo, e.matrix]);
                // }
            }
            // console.log(roomInfo)
            const depListCaps = [];

            // To convert deplist to capital deplists
            depList.forEach((dep) => {
                depListCaps.push(dep.toUpperCase());
            });

            // To render the page at the end of the iteration
            // if (i + 1 === blockList.length) {
            // console.log(
            //     "SEMESTER DETAILS\n",
            //     semester,
            //     "\nSEATING OPTIONS\n",
            //     seatingOption,
            //     "\nDEPARTMENT LISTS\n",
            //     depListCaps,
            //     "\nBLOCKLISTS\n",
            //     blockList,
            //     "\nROOM INFO\n",
            //     roomInfo
            // );
            const depSubObj = {};

            depListCaps.map((dep) => {
                depSubObj[dep] = [];
            });
            //sem: semester, dept: { "$in": depList }
            console.log(semester);
            console.log(depList);
            console.log(depListCaps);
            DeptSub.find({ sem: semester, dept: { "$in": depListCaps } }).then(
                (docs) => {
                    //console.log(docs);
                    docs.map((doc) => {
                        depListCaps.map((dep) => {
                            if (doc.dept == dep) {
                                depSubObj[dep].push(doc.subj);
                            }
                        });
                    });

                    // app.set("semester", semester);
                    // app.set("seatingOption", seatingOption);
                    // app.set("depList", depList);
                    // app.set("blockList", blockList);
                    // app.set("roomInfo", roomInfo);
                    console.log(depSubObj);
                    res.render(
                        "createPlan2",

                        {
                            semester: semester,
                            seatingOption: seatingOption,
                            depList: depList,
                            blockList: blockList,
                            roomInfo: roomInfo,
                            depSubObj: depSubObj,
                            layout: "loggedIn-layout",
                        }
                    );
                    // }
                });

        });
});

module.exports = router;