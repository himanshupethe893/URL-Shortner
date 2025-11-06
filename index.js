const express = require('express');
const dotenv = require('dotenv');
const{connectTOMongooDB}=require('./connect');
const urlRoutes = require('./routes/url');
const cors = require('cors');


dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const app= express();
const PORT = 3000;
const URL = require('./models/url');
connectTOMongooDB(MONGO_URI).then(()=>{
    console.log("Connected to DataBase Successfully");
}).catch((err)=>{
    console.log("Error connecting to DataBase", err);
});
app.use(cors());
app.use(express.json());
app.use("/url", urlRoutes);

// index.js

// index.js
// app.get("/:shortId", async (req, res) => {
//     const shortId = req.params.shortId;

//     // This is the RELIABLE way to find and update.
//     // This is the line that is taking 2.4 seconds
//     // because your free database is slow at WRITING data.
//     const entry = await URL.findOneAndUpdate(
//         {
//             shortId,
//         },
//         {
//             $push: {
//                 visitedHistory: { timestamp: Date.now() },
//             },
//         }
//     );

//     if (!entry) {
//         return res.status(404).json({ error: "Short URL not found" });
//     }

//     // This only happens AFTER the database is updated.
//     res.redirect(entry.redirectURL);
// });
// in index.js

// index.js
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });
app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;

    // !! ADD THIS LINE to filter out browser 'favicon' requests !!
    if (shortId === 'favicon.ico') {
        return res.status(404).json({ error: "Not a valid URL" });
    }

    console.log(`\n[NEW REQUEST] Attempting to find shortId: '${shortId}'`);

    try {
        console.log("[DB] Searching and updating document...");
        const entry = await URL.findOneAndUpdate(
            {
                shortId: shortId, // Make sure this matches
            },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() },
                },
            }
        );

        // This is the most important log.
        // If 'entry' is null, the query found NOTHING.
        console.log("[DB] Operation complete. Document found:", entry);

        if (!entry) {
            console.log("[RESULT] Document NOT FOUND. Sending 404.");
            return res.status(404).json({ error: "Short URL not found" });
        }

        // If we get here, the update was successful
        console.log(`[RESULT] Success. Redirecting to: ${entry.redirectURL}`);
        res.redirect(entry.redirectURL);

    } catch (error) {
        // We still keep this in case of a real error
        console.error("[CRITICAL ERROR] Failed to update history:", error);
        res.status(500).json({ error: "Server error" });
    }
});
app.listen(PORT, () => console.log('Server started at PORT:', PORT));


