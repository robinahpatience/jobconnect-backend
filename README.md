# JobConnect Backend

JobConnect is an Express/Node.js API backed by MySQL. This repository is
the backend fork used for the JobConnect enhancement assignment.

## Added backend feature

**Save Jobs API** --- authenticated job seekers can save a job, list
their saved jobs, and remove a saved job. Saved records are associated
with the signed-in job seeker and the selected job.

## Requirements

-   Node.js and npm
-   MySQL Server
-   A database and application user configured for JobConnect

## Setup

1.  Install dependencies:

    ``` bash
    npm install
    ```

2.  Create the database and tables using the project's existing database
    schema and seed instructions. Review the SQL files before running
    them; do not blindly rerun a schema script that drops existing
    tables.

3.  Create a local `.env` file in the backend directory. Use the
    variable names expected by the application:

    ``` dotenv
    PORT=5000
    DB_HOST=localhost
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    DB_PORT=3306
    JWT_SECRET=replace_with_a_long_random_secret
    JWT_EXPIRES_IN=7d
    FRONTEND_URL=http://localhost:5173
    ```

    Replace the example database values with your own local
    configuration. Never commit `.env` or share passwords and JWT
    secrets.

4.  Start the backend in development mode:

    ``` bash
    npm run dev
    ```

5.  Verify the health endpoint:

    ``` bash
    curl -i http://localhost:5000/api/health
    ```

    A successful local setup should return HTTP 200 and report that the
    database is connected.

## Saved Jobs API

All endpoints require authentication as a job seeker:

  Method     Endpoint                   Purpose
  ---------- -------------------------- --------------------------------------
  `POST`     `/api/saved-jobs/:jobId`   Save a job
  `GET`      `/api/saved-jobs`          List the current seeker's saved jobs
  `DELETE`   `/api/saved-jobs/:jobId`   Remove a saved job

The database table uses a unique constraint for
`(job_seeker_id, job_id)` to prevent duplicate saved records and foreign
keys to maintain referential integrity.

## Main changed files

-   `server.js` --- registers `/api/saved-jobs`.
-   `controllers/savedJobController.js` --- implements saving, listing,
    and removing saved jobs.
-   `routes/savedJobRoutes.js` --- protects the routes and restricts
    access to job seekers.

## Demo accounts

For local demonstration only, the seeded demo accounts use the password
`password123`:

-   Job seeker: `seeker1@jobconnect.com`
-   Employer: `employer1@jobconnect.com` or `employer2@jobconnect.com`
-   Admin: `admin@jobconnect.com`

## for reference
  git clone https://github.com/robinahpatience/jobconnect-backend.git
