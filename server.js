const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

// Rota inicial da API
app.get("/", (req, res) => {
  res.json({
    sucesso: true,
    projeto: "Aquaponia LIRE",
    versao: "2.0",
    rotas: ["GET /dados", "POST /dados", "GET /comando", "POST /comando"]
  });
});

// ESP32 envia dados aqui
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

// Site lê dados aqui
app.get("/dados", (req, res) => {
  res.json(dadosAtuais);
});

// Site envia comando aqui
app.post("/comando", (req, res) => {
  const comando = req.body.comando;
  const comandosPermitidos = ["alimentar", "home", "iniciar"];

  if (comandosPermitidos.includes(comando)) {
    comandoAtual = comando;
    console.log("[COMANDO RECEBIDO]", comandoAtual);
    res.json({ sucesso: true, comando: comandoAtual });
  } else {
    res.status(400).json({ sucesso: false, erro: "Comando inválido" });
  }
});

// ESP32 busca comando aqui. Depois que busca, limpa o comando.
app.get("/comando", (req, res) => {
  const comando = comandoAtual;
  comandoAtual = "";
  res.json({ comando: comando });
});

app.listen(PORT, () => {
  console.log("Servidor iniciado - Aquaponia LIRE API v2.0");
});
