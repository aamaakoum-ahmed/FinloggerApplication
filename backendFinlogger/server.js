import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import expenseRoutes from './routes/expenseRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion vers MongoDB
mongoose
  .connect('mongodb://localhost:27017/finlogger')
  .then(() => console.log('Connecté à MongoDB'))
  .catch((error) =>
    console.error('Erreur de connexion à MongoDB :', error)
  );

// Routes
app.use('/expenses', expenseRoutes);

// Demarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});