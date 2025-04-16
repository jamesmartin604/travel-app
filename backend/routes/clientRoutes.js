//defines the urls that the frontend can use to interact with the backend.
const express = require('express');
const {
    getAllClients,
    getClientByID,
    createClient,
    updateClient,
    deleteClient,
} = require('../controllers/clientController');

const router = express.Router();

router.get('/',getAllClients);
router.get('/:id',getClientByID);
router.post('/',createClient);
router.put('/:id',updateClient);
router.delete('/:id',deleteClient);

module.exports = router;