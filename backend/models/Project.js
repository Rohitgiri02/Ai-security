const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    risk: { type: Number, required: true },
    decision: { type: String, enum: ['allow', 'block'], required: true },
    issues: { type: Array, default: [] },
    ai: { type: Object, default: {} },
    meta: { type: Object, default: {} },
    analyzedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    owner: { type: String, required: true },
    repo: { type: String, required: true },
    fullName: { type: String, required: true },
    defaultBranch: { type: String, default: 'main' },
    isActive: { type: Boolean, default: true },
    latestAnalysis: { type: analysisSchema, default: null },
    analyses: { type: [analysisSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ userId: 1, fullName: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);
