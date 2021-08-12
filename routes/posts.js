//calling router
const router = require('express').Router();

//getting the homepage
router.get("/", (req, res) => {
    console.log('post page');//logging
});

//exporting router
module.exports = router;