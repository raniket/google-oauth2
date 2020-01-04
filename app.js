
require('dotenv').config();
const express = require('express')
const request = require('request-promise');
const app = express()
const port = 8080

app.get('/', (req, res) => res.send('Hello World!'))

app.get("/auth/google", async (req, res) => {
  try {
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&access_type=offline&include_granted_scopes=true&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth%2Fgoogle&response_type=code&client_id=${process.env.CLIENT_ID_OAUTH_GOOGLE}`);

  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

app.get("/oauth/google", async (req, res) => {
  try {
    const { code, error } = req.query;
    if (error !== undefined) res.send(error);
    console.log("code: ", code);
    // const ACCESS_TOKEN_URL = `https://oauth2.googleapis.com/token?code${code}&client_id=${process.env.CLIENT_ID_OAUTH_GOOGLE}&client_secret=${process.env.CLIENT_SECRET_OAUTH_GOOGLE}&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth%2Fgoogle%2Fcb&=grant_type=authorization_code`;
    const payload = {
      method: 'POST',
      // uri: "https://oauth2.googleapis.com/token",
      uri: "https://www.googleapis.com/oauth2/v4/token",
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        client_id: process.env.CLIENT_ID_OAUTH_GOOGLE,
        client_secret: process.env.CLIENT_SECRET_OAUTH_GOOGLE,
        // code: code,
        code: "4/uwGTBtYRU1BOU5BjB51JMC0g_ROYpiL1hlSx_3tCrOjVgF9ibP-ulOEgnm9_B3nx1sZryzyHKL4NX5lO7Ou_-sI",
        access_type: "offline",
        // grant_type: "authorization_code",
        // redirect_uri: "http%3A%2F%2Flocalhost%3A8080%2Fcode%2F",
        // redirect_uri: "http://localhost:8080/oauth/google/cb"
        // redirect_uri: "http://localhost:8080/code/"
        redirect_uri: "http%3A%2F%2Flocalhost%3A8080%2Foauth%2Fgoogle"
      },
      json: true
    }
    const token = await request(payload);
    console.log(token)
    res.send(token);
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});

app.get("/code", async (req, res) => {
  try {
    const { code, error } = req.query;
    res.send({status: "OK"});
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))