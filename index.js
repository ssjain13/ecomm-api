// This is your test secret API key.
const stripeApi = require("stripe");
var cors = require("cors");

const express = require("express");
const app = express();
app.use(cors());
app.use(express.static("public"));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

const stripe = new stripeApi(
  "sk_test_51MOIWsSGyTooPOuOwIsktCbzFaLJmVNkTXYrld5YAFYYmniQ7v5f5VMulMW2mcHjxRnGzj3QGO28FuogrYK6B8I700y96ZelYV"
);

const YOUR_DOMAIN = "http://localhost:5173";

app.post("/create-checkout-session", async (req, res) => {
  const p = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: p.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/canceled`,
    });
    console.log(session);
    res.header("Access-Control-Allow-Origin", "*").send(JSON.stringify(session.url));
  } catch (err) {
    res.status(err.statusCode).send(err.message);
  }
});

app.listen(4242, () => console.log("Running on port 4242"));
