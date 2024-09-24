// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

// Charger les certificats SSL générés avec OpenSSL
const privateKey = fs.readFileSync('/root/coursapi/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/root/coursapi/cert.pem', 'utf8');

// Créer les credentials pour https
const credentials = { key: privateKey, cert: certificate };

// Core
const config = require('./config.js');
const routes = require('./controllers/routes.js');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limiter chaque IP à 100 requêtes par fenêtre de 15 minutes
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Désactiver les en-têtes `X-RateLimit-*`
	// store: ... , // Redis, Memcached, etc. Voir la doc pour plus d'options.
});

module.exports = class Server {
  constructor () {
    this.app = express();
    this.config = config[process.argv[2]] || config.development;
  }

  /*
   * db connect
   * @return {Object} connect
   */
  dbConnect () {
    const host = this.config.mongodb;
    const connect = mongoose.createConnection(host);

    connect.on('error', (err) => {
      setTimeout(() => {
        console.log('[ERROR] users api dbConnect() -> mongodb error');
        this.connect = this.dbConnect(host);
      }, 5000);

      console.error(`[ERROR] users api dbConnect() -> ${err}`);
    });

    connect.on('disconnected', (err) => {
      setTimeout(() => {
        console.log('[DISCONNECTED] users api dbConnect() -> mongodb disconnected');
        this.connect = this.dbConnect(host);
      }, 5000);
    });

    process.on('SIGINT', () => {
      connect.close(() => {
        console.log('[API END PROCESS] users api dbConnect() -> close mongodb connection');
        process.exit(0);
      });
    });

    return connect;
  }

  /**
   * Middleware
   */
  middleware () {
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(limiter);
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  /**
   * Routes
   */
  routes () {
    new routes.Users(this.app, this.connect, this.authenticateToken);
    new routes.Albums(this.app, this.connect, this.authenticateToken);
    new routes.Photos(this.app, this.connect, this.authenticateToken);
    new routes.Auth(this.app);
  
    // Si la route n'existe pas
    this.app.use((req, res) => {
      res.status(404).json({
        'code': 404,
        'message': 'Not Found'
      });
    });
  }

  /**
   * Security
   */
  security () {
    this.app.use(helmet());
    this.app.disable('x-powered-by');
  }

  authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) return res.sendStatus(403);

    jwt.verify(token, 'webforce3', (err, user) => {
      if (err) return res.sendStatus(401);

      req.user = user;
      next();
    });
  }

  /**
   * Redirection HTTP vers HTTPS
   */
  forceHttps () {
    this.app.use((req, res, next) => {
      if (req.secure) {
        return next();
      }
      res.redirect(`https://${req.headers.host}${req.url}`);
    });
  }

  /**
   * Run
   */
  run () {
    try {
      this.connect = this.dbConnect();
      this.security();
      this.middleware();
      this.routes();

      // Forcer HTTP vers HTTPS
      this.forceHttps();

      // Lancer le serveur HTTPS avec les credentials SSL
      https.createServer(credentials, this.app).listen(this.config.port, () => {
        console.log(`Server running on https://localhost:${this.config.port}`);
      });
    } catch (err) {
      console.error(`[ERROR] Server -> ${err}`);
    }
  }
};