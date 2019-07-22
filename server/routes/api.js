const express = require("express");

// Importing the needed models.
const Sale = require("../models/receiptSale").Sale;
const Refund = require("../models/receiptSale").Refund;
const Redeem = require("../models/receiptSale").Redeem;
const Rent = require("../models/rent");
const Allow = require("../models/allow");

// Initializing the router.
const apiRouter = express.Router();

apiRouter.route("/sale")
    .get((req, res, next) => {
        Sale.find({}, (error, sales) => {
            if (error)
                throw error;

            res.json(sales);
        });
    });

apiRouter.route("/sale/:address")
    .get((req, res, next) => {
        let options = {
            from: req.params.address
        };

        // Checking for optional query parameters.
        if (req.query.stage != null)
            options.stage = req.query.stage;

        Sale.find(options, (error, sales) => {
            if (error)
                throw error;

            res.json(sales);
        });
    });

apiRouter.route("/refund")
    .get((req, res, next) => {
        Refund.find({}, (error, refunds) => {
            if (error)
                throw error;

            res.json(refunds);
        });
    });

apiRouter.route("/refund/:address")
    .get((req, res, next) => {
        let options = {
            from: req.params.address
        };

        // Checking for optional query parameters.
        if (req.query.stage != null)
            options.stage = req.query.stage;

        Refund.find(options, (error, refunds) => {
            if (error)
                throw error;

            res.json(refunds);
        });
    });

apiRouter.route("/redeem")
    .get((req, res, next) => {
        Redeem.find({}, (error, redeems) => {
            if (error)
                throw error;

            res.json(redeems);
        });
    });

apiRouter.route("/redeem/:address")
    .get((req, res, next) => {
        let options = {
            from: req.params.address
        };

        // Checking for optional query parameters.
        if (req.query.stage != null)
            options.stage = req.query.stage;

        Redeem.find(options, (error, redeems) => {
            if (error)
                throw error;

            res.json(redeems);
        });
    });

apiRouter.route("/rent")
    .get((req, res, next) => {
        let options = {};

        // Checking for optional query parameters.
        if (req.query.from != null)
            options.from = req.query.from;

        if (req.query.to != null)
            options.leasedTo = req.query.to;

        Rent.find(options, (error, rents) => {
            if (error)
                throw error;

            res.json(rents);
        });
    });

apiRouter.route("/allow")
    .get((req, res, next) => {
        Allow.find({}, (error, allows) => {
            if (error)
                throw error;

            res.json(allows);
        });
    });

module.exports = apiRouter;