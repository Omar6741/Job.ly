"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: 'new4',
    salary: 200000,
    equity: "0.2",
    company_handle: "c1"
    
  };

  test("works", async function () {
    let job1 = await Job.create(newJob);
    expect(job1).toEqual(newJob);

//     const result = await db.query(
//       `SELECT title, salary, equity, company_handle
//            FROM jobs`);
//     expect(result.rows).toEqual([
//       {
//         title: 'new',
//         salary: 200000,
//         equity: true,
//         company_handle: "newcompany",
//       },
//     ]);

});
});