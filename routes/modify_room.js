const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const BlockName = require("../models/BlockName");
const BlockDetails = require("../models/BlockDetails");

router.get("/view", (req, res) => {
    let room_info = []
    BlockName.find({}, (err, result) => {
        let blockname = ['All Blocks'];
        for (let i = 0; i < result.length; i++) {
            blockname.push(result[i].blockId + " - " + result[i].blockName);
        }
        //
        res.render("modify_room_view", { blockname: blockname, room_info: room_info, layout: "loggedIn-layout" });
    });


});

router.get("/add", (req, res) => {
    BlockName.find({}, (err, result) => {
        let blockname = [];
        for (let i = 0; i < result.length; i++) {
            blockname.push(result[i].blockId + " - " + result[i].blockName);
        }
        //
        res.render("modify_room_add", { blockname: blockname, layout: "loggedIn-layout" });
    });

});

router.get("/delete", (req, res) => {
    BlockName.find({}, (err, result) => {
        let blockname = [];
        for (let i = 0; i < result.length; i++) {
            blockname.push(result[i].blockId + " - " + result[i].blockName);
        }
        //
        res.render("modify_room_delete", { blockname: blockname, layout: "loggedIn-layout" });
    });



    //res.render("", { layout: "loggedIn-layout" });
});



router.post("/view", (req, res) => {
    BlockName.find({}, (err, result) => {
        let blockname = ['All Blocks'];
        for (let i = 0; i < result.length; i++) {
            blockname.push(result[i].blockId + " - " + result[i].blockName);
        }
        //
        //console.log("*********", req.body.blockid);
        if (req.body.blockid == "All") {
            BlockDetails.find({}, (err, result) => {
                let room_info = [];
                for (let i = 0; i < result.length; i++) {
                    room_info.push([result[i].blockId, result[i].roomNo, result[i].matrix]);
                }
                res.render("modify_room_view", { blockname: blockname, room_info: room_info, layout: "loggedIn-layout" });
            });
        } else {
            BlockDetails.find({ blockId: req.body.blockid }, (err, result) => {
                let room_info = [];
                for (let i = 0; i < result.length; i++) {
                    room_info.push([result[i].blockId, result[i].roomNo, result[i].matrix]);
                }
                res.render("modify_room_view", { blockname: blockname, room_info: room_info, layout: "loggedIn-layout" });
            });
        }





    });

});

router.post("/add", (req, res) => {
    let bn = req.body.blockid;
    let rn = req.body.roomno;
    //let mat = parseInt(req.body.matrix);
    //console.log(bn, rn, matrix);
    let mat = req.body.matrix;
    let i;

    let room;
    let matt;
    let roma = [];


    rn = rn.split(",");
    mat = mat.split(",");

    if (rn.length == mat.length) {

        for (i = 0; i < rn.length; i++) {
            room = rn[i];
            matt = mat[i];
            room = room.trim();
            matt = matt.trim();

            matt = parseInt(matt);
            roma.push([room, matt]);
        }
        //console.log(roma);
        roma.forEach((ele) => {

            BlockDetails.find({ blockId: bn, roomNo: ele[0] }, (err, doc) => {
                if (doc.length > 0) {
                    console.log("already exist!!");

                } else {
                    const user = new BlockDetails({
                        blockId: bn,
                        roomNo: ele[0],
                        matrix: ele[1]
                    });
                    user.save().then((doc) => console.log(doc))
                        .catch((err) => console.log(err));

                }
            });

        });


    } else {
        console.log("Uneven room number and matrix");
    }

    res.redirect("/examcell/modify/room/view");

});

router.post("/delete", (req, res) => {
    let bn = req.body.blockid;
    let rn = req.body.roomno;
    //console.log(bn, rn);


    rn = rn.split(",");
    //console.log(sem, dept, subj);

    rn.forEach(element => {
        element = element.trim();
        //element = element.toUpperCase();

        BlockDetails.findOneAndDelete({ blockId: bn, roomNo: element }, (err, doc) => {
            if (doc == null) {
                console.log("No such room");
            } else {
                console.log("Room deleted");
            }
        });
    });
    res.redirect("/examcell/modify/room/view");
});





module.exports = router;