const express = require("express");
const app = express();
var cors = require("cors");
// This is your test secret API key.
const stripeApi = require("stripe");
const serverless = require("serverless-http");

const router = express.Router();

app.use("/.netlify/functions/api", router);
app.use(cors({
  origin:"https://ssjain13.github.io/",

}));
app.use(express.static("public"));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const stripe = new stripeApi(
  "sk_test_51MOIWsSGyTooPOuOwIsktCbzFaLJmVNkTXYrld5YAFYYmniQ7v5f5VMulMW2mcHjxRnGzj3QGO28FuogrYK6B8I700y96ZelYV"
);

const YOUR_DOMAIN = "https://ssjain13.github.io/";

router.get("/test", async (req, res) => {
  res.send("Server is running");
});
router.get("/", async (req, res) => {
  res.send("Welcome");
});
router.post("/create-checkout-session", async (req, res) => {
  const p = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: p.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/canceled`,
    });
    res
      .header("Access-Control-Allow-Origin", "*")
      .send(JSON.stringify(session.url));
  } catch (err) {
    res.status(err.statusCode).send(err.message);
  }
});


module.exports.handler = serverless(app);
