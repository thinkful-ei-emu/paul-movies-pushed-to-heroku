require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const MOVIES = require('./pokedex.json');
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


function handleGetMovie(req, res) {
  let response = MOVIES;
  if(req.query.genre){
    response=response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()));
  }
  if(req.query.country){
    response=response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase()));
  }
  if(req.query.avg_vote){
    response=response.filter(movie =>
      Number(movie.avg_vote) >= Number(req.query.avg_vote) );
  }


 
  res.json(response);
}
app.get('/movie', handleGetMovie);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`
  );
});
