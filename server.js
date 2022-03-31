const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
    const { username, password} = req.body;
    res.json({
        username,
        password,
    });
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})