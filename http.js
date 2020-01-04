
require('dotenv').config();
const express = require('express')
const request = require('request-promise');
const app = express()
const port = 8080

app.get('/', (req, res) => res.send('Hello World!'))

app.get("/auth/signin/cb", async (req, res) => {
  try {
    const { code } = req.query;
    const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

    // GET TOKEN
    const options = {
      method: 'POST',
      uri: ACCESS_TOKEN_URL,
      body: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code,
      },
      json: true
    };
    const token = await request(options);
    console.log(token);

    // GET PROFILE DATA
    const payload = {
      method: 'GET',
      uri: "https://api.github.com/user",
      headers: {
        'User-Agent': 'http://developer.github.com/v3/#user-agent-required',
        'Authorization': 'token ' + token,
      },
      json: true
    }
    const userInfo = await request(payload);
    console.log(userInfo);

    res.send(userInfo);
  } catch (error) {
    console.log(error)
    res.send(error.message);
  }
})

app.get("/profile", async (req, res) => {
  const { token } = req.query;
  const payload = {
    method: 'GET',
    uri: "https://api.github.com/user",
    headers: {
      'User-Agent': 'http://developer.github.com/v3/#user-agent-required',
      'Authorization': 'token ' + token,
    },
    json: true
  }
  const userInfo = await request(payload);
  console.log(userInfo)
  res.send({userInfo});
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))