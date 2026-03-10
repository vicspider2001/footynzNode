var express = require('express');
var footynz = express();
var dotenv = require('dotenv');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
dotenv.config();
var MongoUrl = process.env.MongoOnline;
// var MongoOnline = process.env.MongoOnline;
var cors = require('cors')
const bodyparser = require('body-parser');
const res = require('express/lib/response');
var port = process.env.PORT || 80;
var db;


footynz.use(bodyparser.urlencoded({extended:true}));
footynz.use(bodyparser.json());
footynz.use(cors());
footynz.use(express());

// Assuming 'db' is your connected MongoDB database instance
footynz.get('/',(req,res)=>{
    res.send("Welcome to footynz.server")
})

// footynz.get('/getCategory', (req, res) => {
//     let query = {};
    
//     // Access the category from the URL query string
//     const selectedCategory = req.query.category;

//     // Logic: If a category is selected and it's not "All", 
//     // filter the database search.
//     if (selectedCategory && selectedCategory !== 'All') {
//         // IMPORTANT: The key must be 'category' to match your data
//         query = { category: selectedCategory };
//     }

//     // 2. ELSE IF the frontend sends an ID (e.g., ?id=M-22401616A)
//     // This is what you will use for your ProductDetails.jsx page later
//     else if (productId) {
//         query = { id: productId };
//         console.log("Fetching specific product ID:", productId);
//     }

//     // Connect to the 'products' collection
//     db.collection('products').find(query).toArray((err, result) => {
//         if (err) {
//             console.error("Error fetching from MongoDB:", err);
//             return res.status(500).send("Database Error");
//         }

//         // Send the matching products back to Home.jsx
//         console.log(`Found ${result.length} products for: ${selectedCategory || 'All'}`);
//         res.send(result);
//     });
// });

// Use Port 5000
footynz.get('/getCategory', (req, res) => {
    const category = req.query.category;
    let query = {};

    // Logic: Only filter if a specific category is provided and it's NOT "All"
    if (category && category !== 'All') {
        query = { category: category }; // Exact match for "Men", "Women", etc.
    }

    // else if (productId) {
    //     query = { id: productId };
    //     console.log("Fetching specific product ID:", productId);
    // }

    // Connect to your 'products' collection in 'footynzdata'
    db.collection('products').find(query).toArray((err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).send(err);
        }
        // Sends the array of documents back to React
        res.send(result);
    });
});


MongoClient.connect(MongoUrl, (err,client) => {
    if(err) console.log("error while connecting");
    db = client.db('footynzdata');
    footynz.listen(port, '0.0.0.0',()=>{
        console.log(`listening on port ${port}`)
    })
})




