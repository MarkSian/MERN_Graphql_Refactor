import express from 'express';
import path from 'node:path';
import mongoose from 'mongoose';
import cors from 'cors'; // Import cors package
import routes from './routes/api/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import { getUserFromToken } from './services/auth.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'path';
import { JwtPayload } from './services/auth.js';
import { Request } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb+srv://merksianipar:Loremmerri12@bootcamp.agao5.mongodb.net/googlebooks?retryWrites=true&w=majority&appName=Bootcamp'; // this URI is only for this bootcamp

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'Replace with your actual frontend URL' : 'http://localhost:10000', // Allow your frontend to make requests to this server
  credentials: true,  // Allows cookies to be sent with requests if needed
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS for your frontend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();
console.log('Apollo Server started');

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }: { req: Request }) => {
      const token = req.headers.authorization?.split(' ')[1] || '';
      const user = getUserFromToken(token);
      req.user = user as JwtPayload;
      return req ;
    },
  })
);

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1] || '';
      const user = getUserFromToken(token);
      return { user };
    },
  })
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

app.use(routes);
console.log('Routes added...');

mongoose.connect(MONGO_URI);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');

  app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected.');
});