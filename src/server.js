const app = require('./app');

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server berjalan di port ${PORT}`);
  });
}

module.exports = app;
