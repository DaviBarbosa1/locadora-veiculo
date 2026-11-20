import 'dotenv/config';
import { app } from './app.js';

if (!process.env.JWT_SECRET) {
  console.error('Defina JWT_SECRET no arquivo .env');
  process.exit(1);
}

const porta = Number(process.env.PORT) || 3333;

app.listen(porta, () => {
  console.log(`API em execução na porta ${porta}`);
});
