// Import necessary modules
const express = require('express');
const axios = require('axios');
const app = express();

// Define the search endpoint
app.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        // Use Nominatim API to search for hotels
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}+hotel`;
        
        const response = await axios.get(url);
        const results = response.data.map(place => ({
            name: place.display_name,
            description: "No detailed description available",
            amenities: [], // Nominatim does not provide amenities
            image: 'https://example.com/no-image.jpg', // Placeholder image since Nominatim has no images
            price: "N/A", // Nominatim does not provide price information
            rating: "N/A", // Nominatim does not provide ratings
            booking_url: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=18/${place.lat}/${place.lon}`
        }));

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data from the Nominatim API' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});