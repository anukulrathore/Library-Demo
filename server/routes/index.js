const express = require("express");
const bookRouter = require("../controller/bookRouter");


const router = express.Router();

router.use("/book", bookRouter);


module.exports=router;