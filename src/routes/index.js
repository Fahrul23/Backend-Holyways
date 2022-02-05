const express = require('express');
const{ Login, Register, checkAuth } = require('../controllers/Auth');
const {getFundsByUserId, detailUserDonate, addUserDonate, addFund, editFund, deleteFund, editDonateFund, getFunds, detailFund, getUsersDonate } = require('../controllers/Fund');
const {getUsers, deleteUser, editProfile, detailUser} = require('../controllers/User');
const {Auth} = require('../middlewares/Auth')
const {uploadFile} = require('../middlewares/uploadFile')
const router = express.Router()


// Auth
router.get('/check-auth',Auth, checkAuth)
router.post('/login', Login)
router.post('/register', Register)
router.put('/edit-profile', Auth, editProfile)

// Users
router.get('/users', getUsers)
router.get('/user', Auth, detailUser)
router.delete('/user/:id', Auth, deleteUser)

// Funds
router.get('/funds', getFunds)
router.get('/fund',  Auth, getFundsByUserId)
router.get('/fund/:id',detailFund)
router.post('/fund', Auth, uploadFile('thumbnail'), addFund)
router.patch('/fund/:id', Auth, uploadFile('thumbnail'), editFund)
router.delete('/fund/:id', Auth, deleteFund)
router.patch('/fund/:fundId/:userDonateId', Auth, editDonateFund)
router.get('/fund/:fundId/:userDonateId', Auth, detailUserDonate)
router.post('/fund/:fundId',  Auth, uploadFile('proofAttachment'), addUserDonate)

// donate
router.get('/donates',  Auth, getUsersDonate)


module.exports = router