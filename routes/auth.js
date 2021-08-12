//calling router
const router = require('express').Router();


//get all authorized users
router.get('/', (req, res) => {
    res.send("hey its auth route")
});

//exporting router
module.exports = router;