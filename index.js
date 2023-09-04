const express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Your app listening on port ${PORT}`);
});
