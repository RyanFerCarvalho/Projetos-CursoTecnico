const express = require('express')
const router = express.Router()

const ThoughtsController = require('../controllers/ThoughtsController')

const checkAuth = require('../helpers/auth').checkAuth
const thoughtPermission = require('../helpers/auth').thoughtPermission

router.get('/dashboard', checkAuth, ThoughtsController.showDashboard)
router.get('/add', checkAuth, ThoughtsController.createThought)
router.get('/delete/:id', thoughtPermission, ThoughtsController.deleteThought)
router.get('/edit/:id', thoughtPermission, ThoughtsController.editThought)
router.post('/add', checkAuth, ThoughtsController.createThoughtSave)
router.post('/edit/:id', thoughtPermission, ThoughtsController.editThoughtSave)
router.get('/createlike/:thoughtId', checkAuth, ThoughtsController.createLike)
router.get('/deletelike/:thoughtId', checkAuth, ThoughtsController.deleteLike)
router.get('/', ThoughtsController.showThoughts)

module.exports = router
