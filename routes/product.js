const express = require("express");
const router = express.Router();

const { add, 
        productById, 
        read, 
        remove, 
        update, 
        list, 
        listCategories, 
        listBySearch 
    } = require("../controllers/product");

const { requireSignin, 
        isAuth, 
        isAdmin 
    } = require("../controllers/auth");

const {userById} = require("../controllers/user");

router.get("/product/:productId", read);

router.get("/products", list);

router.get("/products/categories", listCategories);

router.post("/products/by/search", listBySearch);

router.post("/product/add/:userId", requireSignin, isAuth, isAdmin, add);

router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, update);

router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, remove);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;