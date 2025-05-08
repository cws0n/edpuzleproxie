const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Serve static files
app.use(express.static('public'));

// Proxy middleware for Edpuzzle
app.use('/edpuzzle', createProxyMiddleware({
  target: 'https://edpuzzle.com',
  changeOrigin: true,
  onProxyRes(proxyRes) {
    // Remove security headers
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
  },
  pathRewrite: {
    '^/edpuzzle': ''
  }
}));

// API endpoint to execute bookmarklets
app.get('/execute', (req, res) => {
  const code = decodeURIComponent(req.query.code);
  res.send(`
    <script>
      try {
        ${code.startsWith('javascript:') ? code.substring(11) : code}
        window.close();
      } catch(e) {
        alert('Error: ' + e.message);
        window.close();
      }
    </script>
  `);
});

app.listen(3000, () => console.log('Server running on port 3000'));
