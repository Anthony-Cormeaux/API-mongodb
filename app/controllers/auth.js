const jwt = require('jsonwebtoken')

const Auth = class Auth {
  /**
   * @constructor
   * @param {Object} app
   */
  constructor(app) {
    this.app = app
    this.run()
  }

  auth() {
    this.app.post('/auth/', (req, res) => {
      try {

        // Extraire les informations du body de la requête
        const { name, pass } = req.body;

        // Vérifier si le nom d'utilisateur et le mot de passe sont corrects
        if (name === process.env.username && pass === process.env.password) {
          // Si correct, générer un token JWT
          const token = jwt.sign({ name, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
          
          // Répondre avec le token
          res.status(200).json({ token });
        } else {
          // Si les informations sont incorrectes, renvoyer une erreur 403
          res.status(403).json({
            code: 403,
            message: 'Invalid username or password'
          });
        }
      } catch (err) {
        console.error(`[ERROR] auth/ -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  /**
   * Run 
   */
  run() {
    this.auth()
  }
}

module.exports = Auth;