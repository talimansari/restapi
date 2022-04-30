const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/restapi', {
    useNewUrlParser: true, // <-- no longer necessary
    useUnifiedTopology: true // <-- no longer necessary
}).then(() => {
    console.log("db running")
}).catch((err) => {
    console.log(err)
})


const productSchema = new mongoose.Schema({ // Shema
    name: String,
    description: String,
    phone: Number,
})

const Product = new mongoose.model("Product", productSchema); //Model
// create product
app.post('/api/v1/product/new', async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// get products
app.get('/api/v1/products', async (req, res) => {
    const products = await Product.find(req.body);
    res.status(200).json({
        success: true,
        products
    })
});

// update product

app.put('/api/v1/product/:id', async (req, res) => {
    let product = await Product.findById(req.params.id);
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        useFindAndModify: false,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        product
    })

});


app.delete("/api/v1/product/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    await product.remove();
  
if(!product){
    return res.status(500).json({
        success:false,
        massage:"something wrong"
    })
}

    res.status(200).json({
        success: true,
        massage: "succesfully deleted"
    })

})

app.listen(PORT, () => {
    console.log(`server running http://localhost:${PORT}`);
})