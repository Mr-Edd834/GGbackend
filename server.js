

const express = require('express');
const app = express();

// force defaults to test
const PORT = 3000;
const HOST = "127.0.0.1";

app.get('/', (req, res) => {
  res.send('it is working 😎');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://${HOST}:${PORT}`);
});
