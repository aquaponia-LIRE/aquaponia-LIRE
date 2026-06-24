const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let dados = {
  temperatura: 0,
  ph: 0,
  bomba: false,
  alimentador: "ativo",
  ultimaAtualizacao: "-"
};

app.get("/", (req, res) => {
  res.send("API Aquaponia LIRE Online");
});

app.get("/dados", (req, res) => {
  res.json(dados);
});

app.post("/dados", (req, res) => {
  dados = {
    ...dados,
    ...req.body,
    ultimaAtualizacao: new Date().toLocaleString("pt-BR")
  };

  res.json({
    sucesso: true
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor iniciado");
});
