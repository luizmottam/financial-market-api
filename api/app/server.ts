import express, { type Request, type Response } from "express";
import stockRouter from "./modules/stock/stock.router"

const app = express();

app.use(express.json());

app.use("/stock", stockRouter)


app.get("/", (req: Request, res: Response) => {
  res.send("API rodando");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});