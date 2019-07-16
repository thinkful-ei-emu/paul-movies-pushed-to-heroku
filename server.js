require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const validTypes = require('./types');
const POKEDEX = require('./pokedex.json');
const cors = require('cors');
const helmet = require('helmet');


const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  if (!req.get('Authorization')) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  const bearerToken = req.get('Authorization').split(' ')[1];
  const apiToken = process.env.API_TOKEN;
  console.log('validate bearer token middleware');

  if (bearerToken !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

function handleGetTypes(req, res) {
  res.json(validTypes);
}

app.get('/types', handleGetTypes);


function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;
  if (req.query.name) {
    response = response.filter(pokemon =>
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    );
  }
  if (req.query.type) {
    response = response.filter(pokemon => pokemon.type.includes(req.query.type)
    );
  }
  res.json(response);
}
app.get('/pokemon', handleGetPokemon);


const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`
  );
});
