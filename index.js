import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  access_token: process.env.ACCESS_TOKEN,
});

const app = express();
const port = 8080;

app.use(
  cors({
    origin: ["https://www.clubvegge.com.ar", "https://club-vegge.vercel.app"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Todo Ok");
});
app.post("/create_preference", async (req, res) => {
  try {
    const preference = {
      items: req.body.items,
      back_urls: {
        success: "https://www.clubvegge.com.ar/home",
        failure: "https://www.clubvegge.com.ar/home",
        pending: "https://www.clubvegge.com.ar/home",
      },
      auto_return: "approved",
      shipments: {
        cost: req.body.shipment_cost,
        mode: "not_specified",
      },
    };
    const response = await mercadopago.preferences.create(preference);
    res.json({
      id: response.body.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear la preferencia :(" });
  }
});

app.listen(port, () => {
  console.log("servidor corriendo en el puerto ${port}");
});
