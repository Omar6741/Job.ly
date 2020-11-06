"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {jobResultsIds, commonBeforeAll, commonBeforeEach, commonAfterEach,commonAfterAll} = require("./_testCommon");

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

    const result = await db.query(
      `SELECT title, salary, equity, company_handle
           FROM jobs 
           WHERE title = 'new4'`);
    expect(result.rows).toEqual([
      {
        title: 'new4',
        salary: 200000,
        equity: "0.2",
        company_handle: "c1",
      },
    ]);
});
test("bad request with dupe", async function () {
    try {
      await Job.create(newJob);
      await Job.create(newJob);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("get", function () {
    const newJob = {
        title: 'new4',
        salary: 200000,
        equity: "0.2",
        company_handle: "c1"
      };
    
    test("works", async function () {
         await Job.create(newJob);
        let job2 = await Job.get("new4");
      expect(job2).toEqual(
          {
              title: 'new4',
              salary: 200000,
              equity: "0.2",
              company_handle: "c1"
            }
      );
    });
  
    test("not found if no such company", async function () {
      try {
        await Job.get("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  /************************************** update */

describe("update", function () {

    const updateData = {
          title: "new",
          salary: 300000,
          equity: "0.3",
    };
  
    test("works", async function () {
       let idJob1 = jobResultsIds[0];
       let job2 = await Job.update(idJob1, updateData);

      expect(job2).toEqual({
        title: "new",
        ...updateData
      });
  
      const result = await db.query(
        `SELECT title, salary, equity, company_handle
             FROM jobs
             WHERE title = 'new'`);
      expect(result.rows).toEqual([{
              title: 'new',
              salary: 300000,
              equity: "0.3",
              company_handle: "c1"
      }]);
    });
});
  
   