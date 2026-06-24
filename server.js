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

// Página principal
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aquaponia LIRE</title>
<style>
body{background:#0D1B2A;color:white;font-family:Arial,sans-serif;text-align:center;padding:20px}
h1{color:#E67E22}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:15px;max-width:1000px;margin:auto}
.card{background:#162535;border-radius:12px;padding:20px}
.valor{font-size:34px;font-weight:bold}
button{border:none;border-radius:8px;padding:12px 18px;margin:6px;font-weight:bold;cursor:pointer;color:white}
.btn-purple{background:#9B59B6}
.btn-green{background:#1ABC9C}
.atualizacao{margin-top:20px;color:#1ABC9C}
.controles{margin-top:25px}
#mensagem{color:#1ABC9C;font-weight:bold}
</style>
</head>
<body>

<h1>🌱 Aquaponia LIRE 🐟</h1>

<div class="grid">
  <div class="card">
    <h2>🌡 Temperatura</h2>
    <div class="valor" id="temperatura">--</div>
  </div>

  <div class="card">
    <h2>🧪 pH</h2>
    <div class="valor" id="ph">--</div>
  </div>

  <div class="card">
    <h2>🍽 Alimentador</h2>
    <div class="valor" id="alimentador">--</div>
  </div>
</div>

<div class="atualizacao">
  <h3>📅 Última atualização</h3>
  <div id="ultimaAtualizacao">--</div>
</div>

<div class="controles">
  <h2>Controles remotos</h2>

  <button class="btn-purple" onclick="enviarComando('alimentar')">
    Alimentar agora
  </button>

  <button class="btn-green" onclick="enviarComando('home')">
    Ir para home
  </button>

  <p id="mensagem"></p>
</div>

<script>
const API_DADOS = "/dados";
const API_COMANDO = "/comando";

async function atualizarDados(){
  try{
    const resposta = await fetch(API_DADOS);
    const dados = await resposta.json();

    document.getElementById("temperatura").innerHTML = dados.temperatura + " °C";
    document.getElementById("ph").innerHTML = dados.ph;
    document.getElementById("alimentador").innerHTML = dados.alimentador || "--";
    document.getElementById("ultimaAtualizacao").innerHTML = dados.ultimaAtualizacao || "--";
  }catch(erro){
    console.error(erro);
  }
}

async function enviarComando(comando){
  document.getElementById("mensagem").innerHTML = "Enviando comando...";

  try{
    await fetch(API_COMANDO, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({comando: comando})
    });

    document.getElementById("mensagem").innerHTML = "Comando enviado: " + comando;
  }catch(erro){
    document.getElementById("mensagem").innerHTML = "Erro ao enviar comando.";
    console.error(erro);
  }
}

atualizarDados();
setInterval(atualizarDados, 10000);
</script>

</body>
</html>`);
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

  if (comando === "alimentar" || comando === "home") {
    comandoAtual = comando;
    console.log("[COMANDO RECEBIDO]", comandoAtual);
    res.json({ sucesso: true, comando: comandoAtual });
  } else {
    res.status(400).json({ sucesso: false, erro: "Comando inválido" });
  }
});

// ESP32 busca comando aqui
app.get("/comando", (req, res) => {
  const comando = comandoAtual;
  comandoAtual = "";
  res.json({ comando: comando });
});

app.listen(PORT, () => {
  console.log("Servidor iniciado");
});
