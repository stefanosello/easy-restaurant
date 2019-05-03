const express = require('express')
const app = express()
const port = 3000

app.use(express.static('./easy-restaurant-frontend/dist/easy-restaurant-frontend'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
