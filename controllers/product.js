const formidable = require("formidable");
const _ = require("lodash");
const Product = require("../models/product");
const {  errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product) {
            return res.status(400).json ({
                error: "Product not found"
            });
        }
        req.product = product;
        next();
    });
};

exports.read = (req, res) => {
    return res.json(req.product);
};

exports.add = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse( req, (err, fields) => {
        if (err) {
            return res.status(400).json ({
                error: "Invalid"
            });
        }

        const { service, category, ratePer1000, pricePerUnit, minOrder, maxOrder } = fields;

        if (!service || !category || !ratePer1000 || !pricePerUnit || !minOrder || !maxOrder) {
            return res.status(400).json ({
                error: "Please enter all fields"
            });
        }

        let product = new Product(fields);

        product.save((err, result) => {
            if (err) {
                return res.status(400).json ({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.remove = (req, res) => {
    let product = req.product
    product.remove((err) => {
        if (err) {
            return res.status(400).json ({
                error: errorHandler(error)
            });
        }
        res.json ({
            "message": "Product successfully removed"
        });
    });
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse( req, (err, fields) => {
        if (err) {
            return res.status(400).json ({
                error: "Wahala"
            });
        }

        let product = req.product;

        product = _.extend(product, fields);

        product.save((err, result) => {
            if (err) {
                return res.status(400).json ({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.list = (req, res) => {
    let order = req.query.oder ? req.query.order: 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy: '_id'
    let limit = req.query.limit ? req.query.limit: 0

    Product.find()
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data) =>{
            if(err) {
                return res.status(400).json ({
                    error: "Products not found"
                });
            }
            res.send(data);
        });
};

exports.listCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if(err) {
            return res.status(400).json ({
                error: "Categories not found"
            });
        }
        res.json(categories);
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "asc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 0;
    // let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "ratePer1000") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][2000],
                    $lte: req.body.filters[key][20000]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .populate("category")
        .sort([[sortBy, order]])
        // .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};