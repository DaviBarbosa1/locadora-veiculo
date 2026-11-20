import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/authRoutes.js';
import { veiculoRoutes } from './routes/veiculoRoutes.js';
import { locacaoRoutes } from './routes/locacaoRoutes.js';
import { naoEncontrado, tratarErros } from './middlewares/tratarErros.js';

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/saude', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/veiculos', veiculoRoutes);
app.use('/locacoes', locacaoRoutes);

app.use(naoEncontrado);
app.use(tratarErros);
