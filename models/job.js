"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Job {
  /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, company_handle }
   *
   * Returns { title, salary, equity, company_handle }
   *
   * Throws BadRequestError if job already in database.
   * */

  static async create({ title, salary, equity, company_handle }) {
    //user must be logged in AND an admin in order to access this function.
    const duplicateCheck = await db.query(
      `SELECT title
           FROM jobs
           WHERE title = $1`,
      [title]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate job: ${title}`);
        console.log(title, salary, equity, company_handle);
    const result = await db.query(
      `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING title, salary, equity, company_handle`,
      [
        title,
        salary,
        equity,
        company_handle,
      ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   *
   * Returns [{ title, salary, equity, company_handle }]
   * */

  static async findAll(title = '', min = 0, hasEquity = false) {
    //checks to see whether a parameter or parameters have been passed.
    let whereClause = '';
    //if a min salary is passed, search only jobs with salaries above that number
    if (min !== 0) {
      whereClause = `WHERE salary >= ${min}`
    }
    //if hasEquity is passed as true, only find jobs that have equity.
    if(hasEquity !== false && whereClause !== ''){
      whereClause += `AND hasEquity = true`;
    }
    else if(hasEquity !== false && whereClause === ''){
      whereClause = `WHERE hasEquity = true`;
    }
    //If a job title is passed and whereClause has a min or equity clause, we add the LIKE title(to find all names with that parameter in it) to our request.
    if (title !== '' && whereClause !== '') {
      whereClause += `AND lower(title) LIKE lower('%${title}%')`;
    }
    //is name is passed and there is no min/max, our whereClause only searches with the name parameter
    else if (title !== '' && whereClause === '') {
      whereClause = `WHERE lower(title) LIKE lower('%${title}%')`;
    }
    const jobsQuery = `SELECT title, equity, salary, company_handle, FROM jobs ${whereClause} ORDER by title`;

    const jobsRes = await db.query(jobsQuery);

    return jobsRes.rows;
  }

  /** Given a job title, return data about job.
   *
   * Returns { title, salary, equity, company_handle}
   *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(title) {
    const jobRes = await db.query(
      `SELECT title,
                  salary,
                  equity,
                  company_handle
           FROM jobs
           WHERE title = $1`,
      [title]);

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job: ${title}`);

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity, company_handle}
   *
   * Returns {title, salary, equity, companyHandle}
   * 
   *
   * Throws NotFoundError if not found.
   */

//   static async update(job, data) {
//     //if user is not an admin, throw error "user cannot update data"
//     if (user.is_admin === 'f') {
//       throw new Error("User cannot update data");
//     }
//     const { setCols, values } = sqlForPartialUpdate(
//       data,
//       {
//         title: "title",
//         salary: "salary",
//         equity: "equity",
//       });
//     const handleVarIdx = "$" + (values.length + 1);

//     const querySql = `UPDATE jobs 
//                       SET ${setCols} 
//                       WHERE title = ${handleVarIdx} 
//                       RETURNING title, 
//                                 salary, 
//                                 equity,
//                                 company_handle`;
//     const result = await db.query(querySql, [...values, title]);
//     const job = result.rows[0];

//     if (!job) throw new NotFoundError(`No job: ${title}`);

//     return job;
//   }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(title) {
    const result = await db.query(
      `DELETE
           FROM jobs
           WHERE title = $1
           RETURNING title`,
      [title]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${title}`);
  }
}


module.exports = Job;
