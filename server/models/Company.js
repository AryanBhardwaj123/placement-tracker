const mongoose = require('mongoose');

const companySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a company name'],
        },
        deadline: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['Applied', 'Interview', 'Selected', 'Rejected'],
            default: 'Applied',
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Company', companySchema);
