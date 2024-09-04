const Photomodel = require('../models/photo.js')
const Albummodel = require('../models/album.js')

const Photos = class Photos {
  constructor (app, connect, authenticateToken) {
    this.app = app
    this.Photomodel = connect.model('Photo', Photomodel)
    this.Albummodel = connect.model('Album', Albummodel)
    this.authenticateToken = authenticateToken

    this.run()
  }

  /**
   * Create a photo in a specific album
   */
  create () {
    this.app.post('/album/:albumId/photo/', (req, res) => {
      try {
        const photoData = { ...req.body, album: req.params.albumId }
        const photomodel = new this.Photomodel(photoData)

        photomodel.save().then((photo) => {
          // Add the photo to the album's photos array
          return this.Albummodel.findByIdAndUpdate(
            req.params.albumId,
            { $push: { photos: photo._id } },
            { new: true }
          ).then(() => {
            res.status(200).json(photo || {})
          })
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          })
        })
      } catch (err) {
        console.error(`[ERROR] photos/create -> ${err}`)

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        })
      }
    })
  }

  /**
   * Get all photos in a specific album
   */
  getAllByAlbum () {
    this.app.get('/album/:albumId/photos/', (req, res) => {
      try {
        this.Photomodel.find({ album: req.params.albumId }).then((photos) => {
          res.status(200).json(photos || [])
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          })
        })
      } catch (err) {
        console.error(`[ERROR] photos/getAllByAlbum -> ${err}`)

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        })
      }
    })
  }

  /**
   * Update a photo by id in a specific album
   */
  updateById () {
    this.app.put('/album/:albumId/photo/:id', (req, res) => {
      try {
        this.Photomodel.findOneAndUpdate(
          { _id: req.params.id, album: req.params.albumId },
          req.body,
          { new: true }
        ).then((photo) => {
          res.status(200).json(photo || {})
        }).catch(() => {
          res.status(500).json({
            code: 500,
            message: 'Internal Server error'
          })
        })
      } catch (err) {
        console.error(`[ERROR] photos/updateById -> ${err}`)

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        })
      }
    })
  }

  /**
   * Delete a photo by id in a specific album
   */
  deleteById () {
    this.app.delete('/album/:albumId/photo/:id', (req, res) => {
      try {
        this.Photomodel.findOneAndDelete({ _id: req.params.id, album: req.params.albumId })
          .then((photo) => {
            if (photo) {
              // Remove the photo from the album's photos array
              return this.Albummodel.findByIdAndUpdate(
                req.params.albumId,
                { $pull: { photos: req.params.id } },
                { new: true }
              ).then(() => {
                res.status(200).json(photo || {})
              })
            } else {
              res.status(404).json({
                code: 404,
                message: 'Photo not found'
              })
            }
          })
          .catch(() => {
            res.status(500).json({
              code: 500,
              message: 'Internal Server error'
            })
          })
      } catch (err) {
        console.error(`[ERROR] photos/deleteById -> ${err}`)

        res.status(400).json({
          code: 400,
          message: 'Bad request'
        })
      }
    })
  }

  /**
   * Run
   */
  run () {
    this.create()
    this.getAllByAlbum()
    this.updateById()
    this.deleteById()
  }
}

module.exports = Photos