import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { MercadoPagoConfig } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

const app = express();
const port = 3000;
app.use(cors());
app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Soy el server");
});

app.post("/create_preference", async (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  try {
    const body = {
      items: req.body.items.map((item) => ({
        title: item.title,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: "ARS",
      })),
      back_urls: {
        success: "https://www.clubvegge.com.ar/home/success/",
        failure: "https://www.clubvegge.com.ar/home/failure/",
        pending: "https://www.clubvegge.com.ar/home/pending/",
      },
      auto_return: "approved",
    };
    console.log("Datos a enviar a MercadoPago:", body);
    const preference = new Preference(client);
    const result = await preference.create({ body });
    console.log("Resultado de la creación de preferencia:", result);
    res.json({ id: result.id });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).json({ message: "Error al crear la preferencia" });
  }
});

app.listen(port, () => {
  console.log(`El servidor del puerto esta corriendo ${port}`);
});
