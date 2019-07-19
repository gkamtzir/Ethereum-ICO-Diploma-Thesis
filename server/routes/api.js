const express = require("express");

// Importing the needed models.
const sale = require("../models/receipt").Sale;
const refund = require("../models/receipt").Refund;
const redeem = require("../models/receipt").Redeem;
const rent = require("../models/rent");
const allow = require("../models/allow");

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

apiRouter.route("/refund")
    .get((req, res, next) => {
        refund.find({}, (error, refunds) => {
            if (error)
                throw error;

            res.json(refunds);
        });
    });

apiRouter.route("/redeem")
    .get((req, res, next) => {
        redeem.find({}, (error, redeems) => {
            if (error)
                throw error;

            res.json(redeems);
        });
    });

apiRouter.route("/rent")
    .get((req, res, next) => {
        rent.find({}, (error, rents) => {
            if (error)
                throw error;

            res.json(rents);
        });
    });

apiRouter.route("/allow")
    .get((req, res, next) => {
        allow.find({}, (error, allows) => {
            if (error)
                throw error;

            res.json(allows);
        });
    });

module.exports = apiRouter;