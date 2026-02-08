const mongoose = require('mongoose');

const industryProgressSchema = new mongoose.Schema(
  {
    industry: {
      type: String,
      required: true,
    },
    roundsCompleted: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  progress: {
    type: [industryProgressSchema],
    default: [],
  },
  totalXP: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

/**
 * Finds a user by ID and updates their roundsCompleted and xpEarned for a specific industry.
 * If the industry doesn't exist in their progress array, pushes a new industry object.
 * Also updates totalXP by adding the new XP points.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string} industry - Industry name (e.g. 'music', 'automotive', 'investment-banking')
 * @param {Object} update - Values to add for this industry
 * @param {number} update.roundsCompleted - Number of rounds to add (default 0)
 * @param {number} update.xpEarned - XP points to add (default 0)
 * @returns {Promise<Document|null>} Updated user document or null if not found
 */
async function updateUserProgress(userId, industry, { roundsCompleted = 0, xpEarned = 0 }) {
  const user = await User.findById(userId);
  if (!user) return null;

  const progressEntry = user.progress.find(
    (p) => p.industry.toLowerCase() === industry.toLowerCase()
  );

  if (progressEntry) {
    progressEntry.roundsCompleted += roundsCompleted;
    progressEntry.xpEarned += xpEarned;
  } else {
    user.progress.push({
      industry,
      roundsCompleted,
      xpEarned,
    });
  }

  user.totalXP += xpEarned;
  await user.save();

  return user;
}

module.exports = { User, updateUserProgress };
