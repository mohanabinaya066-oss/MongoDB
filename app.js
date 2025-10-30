const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/productCatalogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected!'))
.catch(err => console.log(err));

// Import Model
const Product = require('./models/product');

// Routes
app.get('/', async (req, res) => {
  const products = await Product.find();
  res.render('index', { products });
});

app.get('/add', (req, res) => {
  res.render('addProduct');
});

app.post('/add', async (req, res) => {
  const { name, category, price, description } = req.body;
  const newProduct = new Product({ name, category, price, description });
  await newProduct.save();
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));