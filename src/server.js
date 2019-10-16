import app from './app';

app.listen(process.env.PORT, () => {
  console.log(`Listening port ${process.env.PORT}`);
});
