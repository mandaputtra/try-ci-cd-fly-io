import App from "./server";
const PORT = 3000;

new App().app.listen(PORT, "0.0.0.0", () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
