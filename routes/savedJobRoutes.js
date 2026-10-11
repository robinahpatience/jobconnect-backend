const express = require('express');
const {
  saveJob,
  getSavedJobs,
  removeSavedJob
} = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All saved-job routes require an authenticated job seeker.
router.use(protect, authorize('job_seeker'));

router.post('/:jobId', saveJob);
router.get('/', getSavedJobs);
router.delete('/:jobId', removeSavedJob);

module.exports = router;
