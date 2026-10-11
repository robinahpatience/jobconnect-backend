const pool = require('../config/db');

// Save a job for the logged-in job seeker.
const saveJob = async (req, res) => {
  const jobId = req.params.jobId;

  try {
    const [jobs] = await pool.query(
      "SELECT id FROM jobs WHERE id = ? AND status = 'open' LIMIT 1",
      [jobId]
    );

    if (!jobs.length) {
      return res.status(404).json({ message: 'Open job not found' });
    }

    try {
      await pool.query(
        'INSERT INTO saved_jobs (job_seeker_id, job_id) VALUES (?, ?)',
        [req.user.id, jobId]
      );
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'You have already saved this job' });
      }
      throw error;
    }

    res.status(201).json({ message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Could not save job', error: error.message });
  }
};

// List saved jobs belonging only to the logged-in job seeker.
const getSavedJobs = async (req, res) => {
  try {
    const [jobs] = await pool.query(
      `SELECT jobs.*, employer_profiles.company_name, saved_jobs.saved_at
       FROM saved_jobs
       JOIN jobs ON jobs.id = saved_jobs.job_id
       LEFT JOIN employer_profiles ON employer_profiles.user_id = jobs.employer_id
       WHERE saved_jobs.job_seeker_id = ?
       ORDER BY saved_jobs.saved_at DESC`,
      [req.user.id]
    );

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Could not load saved jobs', error: error.message });
  }
};

// Remove a saved job belonging to the logged-in job seeker.
const removeSavedJob = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM saved_jobs WHERE job_seeker_id = ? AND job_id = ?',
      [req.user.id, req.params.jobId]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({ message: 'Saved job removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Could not remove saved job', error: error.message });
  }
};

module.exports = { saveJob, getSavedJobs, removeSavedJob };
