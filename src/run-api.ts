import express from 'express';

const port = process.env.PORT || 10000;
const app = express();

app.use(express.json());

app.get('/health-check', (_req, res) => {
  res.send('>>> BookClubBot is UP, at your service!');
});

app.listen(port, () => {
  console.log('>>> BookClub API RUNNING!', { 'process.env': process.env });
});
