const express = require('express');
const router = express.Router();
const {
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
} = require('../controllers/companyController');

// Route for getting all companies and creating a new one
router.route('/').get(getCompanies).post(createCompany);

// Route for updating and deleting a specific company by ID
router.route('/:id').put(updateCompany).delete(deleteCompany);

module.exports = router;
