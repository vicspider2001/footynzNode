var express = require('express');
var footynz = express();
var dotenv = require('dotenv');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var cors = require('cors');
const bodyparser = require('body-parser');

dotenv.config();

var MongoUrl = process.env.MongoOnline;
var port = process.env.PORT;
var db;

// Middleware configuration
footynz.use(bodyparser.urlencoded({ extended: true }));
footynz.use(bodyparser.json());
footynz.use(cors());
// REMOVED: footynz.use(express()); <-- This was breaking the app

// Routes
footynz.get('/', (req, res) => {
    res.send("Welcome to footynz.server");
});

footynz.get('/getCategory', (req, res) => {
    const category = req.query.category;
    const productId = req.query.id;

    let query = {};

    if (productId) {
        query = { id: productId };
    } else if (category && category !== 'All') {
        query = { category: category };
    } else {
        query = { isFeatured: true };
    }

    // Safety check to ensure DB is connected before querying
    if (!db) {
        return res.status(500).send("Database connection is not established yet.");
    }

    db.collection('products').find(query).toArray((err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).send(err);
        }
        console.log(`Sending ${result ? result.length : 0} products for category: ${category || 'Featured'}`);
        res.send(result);
    });
});

// Robust MongoDB Connection handling
if (!MongoUrl) {
    console.error("FATAL ERROR: MongoOnline is not defined in your environment variables.");
    process.exit(1);
}

MongoClient.connect(MongoUrl, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error("Database connection failed! Server will not start.");
        console.error(err);
        process.exit(1); // Stop the process so you can see the error logs clearly
    }
    
    // Successfully connected
    db = client.db('footynzdata');
    console.log("Connected successfully to MongoDB.");

    // Start the server ONLY after the database is ready
    footynz.listen(port, '0.0.0.0', () => {
        console.log(`Server is up and listening on port ${port}`);
    });
});
