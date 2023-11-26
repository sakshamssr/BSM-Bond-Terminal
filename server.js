const express = require("express");
const main = require('./index.js');

const app = express();

app.get("/", async (req, res) => {
    res.send("Working!!");
});

app.get("/api", async (req, res) => {
    res.send(await main("Apple"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
