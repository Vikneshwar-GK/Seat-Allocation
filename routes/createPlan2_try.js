const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const BlockDetails = require("../models/BlockDetails");
const DeptSub = require("../models/DeptSub");

router.get("/plan1", (req, res) =>
    res.render("createPlan1", { layout: "loggedIn-layout" })
);

const app = express();
console.log(app.get("some"), "routes  bkjgkh");

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
    roomInfo = {
        A: {},
        B: {},
        C: {},
        D: {},
    };

    // blockList.forEach((b, i) => {
    // console.log(i, blockList);
    console.log(depList);
    BlockDetails.find({
            blockId: { "$in": blockList }
        },
        (err, result) => {
            console.log(result);
            for (let i = 0; i < result.length; i++) {
                let e = result[i];
                // console.log(e);
                if (e.blockId === "A") {
                    roomInfo.A.e.roomNo = e.matrix;
                } else if (e.blockId === "B") {
                    roomInfo.B.e.roomNo = e.matrix;
                    roomInfo.B.push(e.roomNo);
                } else if (e.blockId === "C") {
                    roomInfo.C.e.roomNo = e.matrix;

                } else if (e.blockId === "D") {
                    roomInfo.D.e.roomNo = e.matrix;
                }
            }
            // console.log(roomInfo)
            const depListCaps = [];

            // To convert deplist to capital deplists
            depList.forEach((dep) => {
                depListCaps.push(dep.toUpperCase());
            });

            // To render the page at the end of the iteration
            // if (i + 1 === blockList.length) {
            console.log(
                "SEMESTER DETAILS\n",
                semester,
                "\nSEATING OPTIONS\n",
                seatingOption,
                "\nDEPARTMENT LISTS\n",
                depListCaps,
                "\nBLOCKLISTS\n",
                blockList,
                "\nROOM INFO\n",
                roomInfo
            );

            app.set("semester", semester);
            app.set("seatingOption", seatingOption);
            app.set("depList", depList);
            app.set("blockList", blockList);
            app.set("roomInfo", roomInfo);

            res.render(
                "createPlan2",

                {
                    semester: semester,
                    seatingOption: seatingOption,
                    depList: depList,
                    blockList: blockList,
                    roomInfo: roomInfo,
                    layout: "loggedIn-layout",
                }
            );
            // }
        });

    // });
});

module.exports = router;


// *****************************************
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const BlockDetails = require("../models/BlockDetails");
const DeptSub = require("../models/DeptSub");

router.get("/plan1", (req, res) =>
    res.render("createPlan1", { layout: "loggedIn-layout" })
);

const app = express();
console.log(app.get("some"), "routes  bkjgkh");

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
    roomInfo = {
        A: [],
        B: [],
        C: [],
        D: [],
    };

    blockList.forEach((b, i) => {
        // console.log(i, blockList);
        BlockDetails.find({ blockId: b })
            .then((doc) => {
                doc.forEach((e) => {
                    // console.log(e);
                    if (e.blockId === "A") {
                        roomInfo.A.push(e.roomNo);
                    } else if (e.blockId === "B") {
                        roomInfo.B.push(e.roomNo);
                    } else if (e.blockId === "C") {
                        roomInfo.C.push(e.roomNo);
                    } else if (e.blockId === "D") {
                        roomInfo.D.push(e.roomNo);
                    }
                });

                const depListCaps = [];

                // To convert deplist to capital deplists
                depList.forEach((dep) => {
                    depListCaps.push(dep.toUpperCase());
                });

                // To render the page at the end of the iteration
                if (i + 1 === blockList.length) {
                    console.log(
                        "SEMESTER DETAILS\n",
                        semester,
                        "\nSEATING OPTIONS\n",
                        seatingOption,
                        "\nDEPARTMENT LISTS\n",
                        depListCaps,
                        "\nBLOCKLISTS\n",
                        blockList,
                        "\nROOM INFO\n",
                        roomInfo
                    );

                    app.set("semester", semester);
                    app.set("seatingOption", seatingOption);
                    app.set("depList", depList);
                    app.set("blockList", blockList);
                    app.set("roomInfo", roomInfo);

                    res.render(
                        "createPlan2",

                        {
                            semester: semester,
                            seatingOption: seatingOption,
                            depList: depList,
                            blockList: blockList,
                            roomInfo: roomInfo,
                            layout: "loggedIn-layout",
                        }
                    );
                }
            })
            .catch((err) => console.log(err));
    });
});

module.exports = router;