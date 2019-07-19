const express = require("express");

// Importing the needed models.
const sale = require("../models/receipt.js").Sale;
const refund = require("../models/receipt.js").Refund;

// Initializing the router.
const apiRouter = express.Router();

apiRouter.route("/sale")
    .get((req, res, next) => {
        sale.find({}, (error, sales) => {
            if (error)
                throw error;

            res.json(sales);

        });
    });

module.exports = apiRouter;