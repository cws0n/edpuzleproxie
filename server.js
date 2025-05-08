const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Proxy all requests to Edpuzzle
app.use('/', createProxyMiddleware({
    target: 'https://edpuzzle.com',
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
        // Remove security headers that block iframing
        delete proxyRes.headers['x-frame-options'];
        delete proxyRes.headers['content-security-policy'];
    }
}));

const PORT = 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
