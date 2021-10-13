const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const BlockName = require("../models/BlockName");

//import alert from 'alert-node'
// var popupS;
// if (typeof document !== 'undefined') {
//     var popupS = require('popups').default;
// }


router.get("/view", (req, res) => {
    BlockName.find({}, (err, result) => {
        let blockname = [];
        for (let i = 0; i < result.length; i++) {
            blockname.push([result[i].blockId, result[i].blockName]);
        }
        res.render("modify_block_view", { blockname: blockname, layout: "loggedIn-layout" });
    });
});

router.get("/add", (req, res) => {
    res.render("modify_block_add", { layout: "loggedIn-layout" });
});

router.get("/delete", (req, res) => {
    BlockName.find({}, (err, result) => {
        let blockname = [];
        for (let i = 0; i < result.length; i++) {
            blockname.push(result[i].blockId + " - " + result[i].blockName);
        }
        //
        res.render("modify_block_delete", { blockname: blockname, layout: "loggedIn-layout" });
    });
});


router.post("/add", (req, res) => {
    //alert("hellpp");
    // popupS.alert({
    //     content: 'Hello World!'
    // });
    //console.log("********");
    //console.log(req.body.blockid);
    let ide = req.body.blockid;
    ide = ide.toUpperCase();
    BlockName.find({ blockId: ide }, (err, doc) => {
        if (doc.length > 0) {
            console.log("already exist!!");
            // popup.alert({
            //     content: 'Already Exist!!'
            // });
            //alert("Already exist");
        } else {
            const user = new BlockName({
                blockName: req.body.blockname,
                blockId: ide,
            });
            user.save().then((doc) => console.log("Added!!"))
                .catch((err) => console.log(err));
        }
    });
    res.redirect("/examcell/modify/block/view");
});

router.post("/delete", (req, res) => {
    //BlockName.findOneAndDelete({ blockId : re})
    //console.log("**///////////");
    BlockName.findOneAndDelete({ blockId: req.body.blockid }, (err, doc) => {
        console.log("Block deleted");
    });
    res.redirect("/examcell/modify/block/view");
});

module.exports = router;