const asyncHandler = require('express-async-handler'); // Optional but good for clean code, or try-catch blocks.
// User asked for "clean beginner-friendly comments".
// I'll stick to try-catch for simplicity without extra dependencies if possible, or just standard async/await.
// Let's use standard try/catch to keep it dependency-light (besides what I added to package.json) or just manual.
// Actually, I didn't add express-async-handler to package.json. I'll use standard try/catch blocks.

const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = async (req, res, next) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new company application
// @route   POST /api/companies
// @access  Public
const createCompany = async (req, res, next) => {
    console.log("POST /api/companies request received:", req.body); // Debug log

    try {
        const { name, deadline, status, notes } = req.body;

        // 1. Validation
        if (!name) {
            console.error("Validation Error: Missing 'name' field");
            res.status(400);
            throw new Error('Please add a company name');
        }

        // 2. Create in MongoDB
        console.log("Attempting to save to MongoDB...", { name, deadline });

        const company = await Company.create({
            name,
            deadline,
            status: status || 'Applied', // Default fallback
            notes,
        });

        console.log("Successfully created company:", company._id);
        res.status(201).json(company);

    } catch (error) {
        console.error("CRITICAL ERROR in createCompany:", error.message);
        console.error("Stack Trace:", error.stack);

        // Mongoose Validation Error
        if (error.name === 'ValidationError') {
            res.status(400);
            // Extract messages from all failed fields
            const messages = Object.values(error.errors).map(val => val.message);
            error.message = messages.join(', ');
        }

        // Pass to global error handler
        next(error);
    }
};

// @desc    Update company details
// @route   PUT /api/companies/:id
// @access  Public
const updateCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            res.status(404);
            throw new Error('Company not found');
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated document
        );

        res.status(200).json(updatedCompany);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Public
const deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            res.status(404);
            throw new Error('Company not found');
        }

        await company.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
};
