
require('dotenv').config();
const express = require('express')
const request = require('request-promise');
const { google } = require('googleapis');
const app = express()
const port = 8080

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID_OAUTH_GOOGLE,
  process.env.CLIENT_SECRET_OAUTH_GOOGLE,
  "http://localhost:8080/oauth/google"
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  // 'https://www.googleapis.com/auth/blogger',
  // 'https://www.googleapis.com/auth/calendar'
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes
});

app.get('/', (req, res) => res.send('Hello World!'))

app.get("/auth/google", async (req, res) => {
  try {
    console.log(url);
    res.redirect(url)
  } catch (error) {
    console.log(error)
    res.send(error.message);
  }
})

app.get("/oauth/google", async (req, res) => {
  try {
    const { code, error } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    const { access_token} = tokens;
    console.log("access_token::: ", access_token);
    const payload = {
      method: 'GET',
      // uri: `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${access_token}`,
      uri: `https://www.googleapis.com/plus/v1/people/me?access_token=${access_token}`,
      headers: {
        // 'User-Agent': 'http://developer.github.com/v3/#user-agent-required',
        'Authorization': 'token ' + access_token,
      },
      json: true
    }
    const profile = await request(payload);
    console.log(profile);
    res.send(tokens);
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))