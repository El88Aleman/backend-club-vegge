const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");
require("dotenv").config();

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

app.use(express.json());
app.use(
  cors({
    origin: ["https://www.clubvegge.com.ar", "https://club-vegge.vercel.app"],
  })
);

app.get("/", (req, res) => {
  res.send("Todo Ok");
});
app.post("/create_preference", (req, res) => {
  let preference = {
    items: req.body.items,
    back_urls: {
      success: "https://www.clubvegge.com.ar/home",
      failure: "https://www.clubvegge.com.ar/home",
      pending: "",
    },
    auto_return: "approved",
    shipments: {
      cost: req.body.shipment_cost,
      mode: "not_specified",
    },
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(8080, () => {
  console.log("servidor corriendo");
});
