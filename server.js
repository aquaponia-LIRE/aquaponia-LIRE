const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("."));

let dadosAtuais = {
  temperatura: "--",
  ph: "--",
  alimentador: "--",
  diaAtual: "--",
  alimentacoes: 0,
  ciclos: 0,
  proximaAlimentacao: "--",
  ultimaAtualizacao: "--"
};

let comandoAtual = "";

app.post("/dados", (req, res) => {
  dadosAtuais = {
    ...dadosAtuais,
    ...req.body,
    ultimaAtualizacao: new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo"
    })
  };

  console.log("[DADOS]", dadosAtuais);
  res.json({ sucesso: true });
});

app.get("/dados", (req, res) => {
  res.json(dadosAtuais);
});

app.post("/comando", (req, res) => {
  const comando = req.body.comando;
  const comandosPermitidos = ["alimentar", "home", "iniciar"];

  if (comandosPermitidos.includes(comando)) {
    comandoAtual = comando;
    console.log("[COMANDO RECEBIDO]", comandoAtual);
    res.json({ sucesso: true, comando: comandoAtual });
  } else {
    res.status(400).json({
      sucesso: false,
      erro: "Comando inválido"
    });
  }
});

app.get("/comando", (req, res) => {
  const comando = comandoAtual;
  comandoAtual = "";
  res.json({ comando: comando });
});

app.listen(PORT, () => {
  console.log("Servidor iniciado - Aquaponia LIRE v2.0");
});
