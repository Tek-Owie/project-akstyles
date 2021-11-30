const Category = require("../models/category");
const {  errorHandler } = require("../helpers/dbErrorHandler");
const category = require("../models/category");

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json ({
                error: "Category not found"
            });
        }
        req.category = category;
        next();
    });
}

exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if (err) {
            return res.status(400).json ({
                error: errorHandler(err)
            });
        }
        res.json({data});
    })
}

exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name
    category.save((err, data) => {
        if (err) {
            return res.status(400).json ({
                error: errorHandler(err)
            });
        }
        res.json({data});
    })
}

exports.read = (req, res) => {
    return res.json(req.category);
}

exports.remove = (req, res) => {
    let category = req.category
    category.remove((err, data) => {
        if (err) {
            return res.status(400).json ({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Category deleted"
        });
    })
}

exports.list = (req, res) => {
    category.find().exec((err, categories) => {
        if (err) {
            return res.status(400).json ({
                error: errorHandler(err)
            });
        }
        res.json(categories);
    });
}