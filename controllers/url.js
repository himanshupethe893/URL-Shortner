// import shortid from 'shortid';
const shortid=require('shortid');
const URL = require('../models/url');
async function handlegenerateNewShortUrl(req, res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({error:"URL is required!!"})
    
    const shortID = shortid.generate();
    await URL.create({
        shortId :shortID,
        redirectURL: body.url,
        visitedHistory: [],
    });
    return res.json({id: shortID});
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    // --- NEW: Define options for IST conversion ---
    const istOptions = {
        timeZone: 'Asia/Kolkata', // Specify the target time zone
        hour12: true,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    // --- NEW: Convert the timestamps to IST strings ---

    // 1. Convert the main 'createdAt' timestamp
    const createdAtIST = result.createdAt.toLocaleString('en-IN', istOptions);

    // 2. Convert the 'visitHistory' array
    const analyticsIST = result.visitHistory.map(visit => {
        // Create a Date object from the stored number
        const visitDate = new Date(visit.timestamp); 
        return {
            // Convert it to an IST string
            timestamp: visitDate.toLocaleString('en-IN', istOptions) 
        };
    });

    // --- Send the converted data ---
    return res.json({
        totalClicks: result.visitHistory.length,
        createdAt: createdAtIST, // Now sends the IST string
        analytics: analyticsIST, // Now sends the array of IST strings
    });
};

module.exports = { handlegenerateNewShortUrl, handleGetAnalytics };
