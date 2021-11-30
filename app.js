const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");

//app
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

require("dotenv").config();

const authRoutes = require("./routes/auth");

const userRoutes = require("./routes/user");

const categoryRoutes = require("./routes/category");

const productRoutes = require("./routes/product");

//db
mongoose.connect((process.env.DATABASE), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB CONNECTED'));

//middleware
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());
app.use(expressValidator());

//routes
app.use("/api", authRoutes);

app.use("/api", userRoutes);

app.use("/api", categoryRoutes);

app.use("/api", productRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));