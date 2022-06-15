const express = require("express");
const router = express.Router();
const { verify } = require("../controllers/auth");

const { overview, base, tourDetail } = require("../controllers/view");

// router.use(verify);

router.get("/", base);
router.get("/overview", overview);
router.get("/tour/:id", tourDetail)

module.exports = router;
