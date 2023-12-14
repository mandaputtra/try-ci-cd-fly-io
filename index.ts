import App from './server'
const PORT = 3000;

new App().app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
