//calling router
const router = require('express').Router();


//get all users
router.get('/', (req, res) => {
    res.send("hey its user route")
});

//exporting router
module.exports = router;