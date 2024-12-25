const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'https://agency-services.onrender.com',
    secure: false,
    changeOrigin: true,
    ws: true,
    logLevel: 'debug'
  }
];

module.exports = PROXY_CONFIG;
