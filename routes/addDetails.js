const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const DepSub = require('../models/DeptSub');

router.get('/', (req, res) => res.render('addDetails', { layout: 'loggedIn-layout' }));
router.post('/', (req, res) => {
    const { semester, department, subcode } = req.body;
    let errors = [];
    if (subcode.length != 7) {
        errors.push({ msg: 'Enter a valid subcode' });
        console.log(errors, "errors exist");
    }
    if (errors) {
        res.render('addDetails', errors);
        console.log(errors, "error");
    }
    //console.log( subcode );
    const deptSub = new DepSub({
        semester: semester,
        dept: department,
        subCode: subcode
    });
    deptSub.save().then(doc => console.log(doc)).catch(err => console.log(err));
});

module.exports = router;