const Albummodel = require('../models/album.js')

const Albums = class Albums {
  /**
   * @constructor
   * @param {Object} app
   * @param {Object} connect
   * @param {Function} authenticateToken
   */
  constructor (app, connect) {
    this.app = app
    this.Albummodel = connect.model('Album', Albummodel)

    this.run()
  }

  /**
   * Delete by id
   */
  deleteById () {
    this.app.delete('/album/:id', (req, res) => {
      try {
        this.Albummodel.findByIdAndDelete(req.params.id).then((album) => {
          res.status(200).json(album || {})
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          })
        })
      } catch (err) {
        console.error(`[ERROR] albums/:id -> ${err}`)

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        })
      }
    })
  }

  showById () {
    this.app.get('/album/:id', (req, res) => {
      try {
        this.Albummodel.findById(req.params.id).populate('photos').then((album) => {
          res.status(200).json(album || {})
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          })
        })
      } catch (err) {
        console.error(`[ERROR] albums/:id -> ${err}`)
  
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        })
      }
    })
  }

  /**
   * Create
   */
  create () {
    this.app.post('/album/', (req, res) => {
      try {
        const albummodel = new this.Albummodel(req.body)
        albummodel.save().then((album) => {
          res.status(200).json(album || {})
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          })
        })
      } catch (err) {
        console.error(`[ERROR] albums/create -> ${err}`)

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }


  getAll() {
    this.app.get('/albums/', (req, res) => {
      try {
        this.Albummodel.find().then((albums) => {
          res.status(200).json(albums || []);
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          });
        });
      } catch (err) {
        console.error(`[ERROR] albums/getAll -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }

  update() {
    this.app.put('/album/:id', (req, res) => {
      try {
        this.Albummodel.findByIdAndUpdate(req.params.id, req.body, { new: true })
          .then((album) => {
            res.status(200).json(album || {});
          })
          .catch(() => {
            res.status(500).json({
              code: 500,
              message: 'Internal Server error',
            });
          });
      } catch (err) {
        console.error(`[ERROR] albums/update -> ${err}`);

        res.status(400).json({
          code: 400,
          message: 'Bad request',
        });
      }
    });
  }

  /**
   * Run
   */
  run () {
    this.create(),
    this.showById(),
    this.deleteById(),
    this.getAll(),
    this.update();
  }
}

module.exports = Albums