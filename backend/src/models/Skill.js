const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'programming',
      'design',
      'cybersecurity',
      'data_science',
      'cloud_computing',
      'devops',
      'mobile_dev',
      'web_dev',
      'ai_ml',
      'blockchain',
      'networking',
      'database',
      'ui_ux',
      'project_management',
      'carpentry',
      'electrical',
      'plumbing',
      'welding',
      'auto_mechanics',
      'culinary',
      'graphic_design',
      'healthcare',
      'agriculture',
      'business',
      'personal_development',
      'other'
    ],
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true,
  },
  tags: [String],
  image: {
    type: String,
    default: '',
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Skill', SkillSchema);