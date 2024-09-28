const express = require('express');
const bodyParser = require('body-parser');
const brain = require('brain.js');

const app = express();
app.use(bodyParser.json());

const port = 3000;

const net = new brain.NeuralNetwork();

net.train([
  { input: { consulta: 1 }, output: { resposta: 'Para agendar uma consulta, entre em contato com o número (82) 9999-9999 ou acesse nosso site.' } },
  { input: { horario: 1 }, output: { resposta: 'Estamos abertos de segunda a sexta, das 8h às 18h, e aos sábados, das 8h às 12h.' } },
  { input: { especialidades: 1 }, output: { resposta: 'Nossa clínica oferece cardiologia, pediatria, dermatologia e ortopedia.' } },
  { input: { localizacao: 1 }, output: { resposta: 'A clínica está localizada na Av. Muniz Falcão, 1200 - Barro Duro, Maceió - AL.' } }
]);

function categorizeQuestion(question) {
  const lowerCaseQuestion = question.toLowerCase();

  if (lowerCaseQuestion.includes('consulta') || lowerCaseQuestion.includes('agendar')) {
    return { consulta: 1 };
  } else if (lowerCaseQuestion.includes('horário') || lowerCaseQuestion.includes('aberto')) {
    return { horario: 1 };
  } else if (lowerCaseQuestion.includes('especialidades') || lowerCaseQuestion.includes('médico')) {
    return { especialidades: 1 };
  } else if (lowerCaseQuestion.includes('localização') || lowerCaseQuestion.includes('onde')) {
    return { localizacao: 1 };
  } else {
    return null;
  }
}

app.post('/chat', (req, res) => {
  const { message } = req.body;

  const input = categorizeQuestion(message);

  if (input) {
    const output = net.run(input);
    res.json({ resposta: output.resposta });
  } else {
    res.json({ resposta: 'Desculpe, não entendi sua pergunta. Por favor, tente novamente.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
