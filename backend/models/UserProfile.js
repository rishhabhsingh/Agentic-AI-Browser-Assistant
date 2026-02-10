const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: 'default_user'
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  professional: {
    currentTitle: String,
    company: String,
    linkedIn: String,
    github: String,
    portfolio: String,
    yearsOfExperience: Number
  },
  education: {
    degree: String,
    major: String,
    university: String,
    graduationYear: String,
    gpa: String
  },
  customFields: [{
    label: String,
    value: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);