"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./jobs.js");
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
    title: 'new',
    salary: 200000,
    equity: true,
    company_handle: "newcompany",
    
  };

  test("works", async function () {
    let job1 = await Job.create(newJob);
    expect(job1).toEqual(newJob);

    const result = await db.query(
      `SELECT title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'new'`);
    expect(result.rows).toEqual([
      {
        title: 'new',
        salary: 200000,
        equity: true,
        company_handle: "newcompany",
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
  test("works", async function () {
    let job1 = await Job.get("new");
    expect(job1).toEqual(
        {
            title: 'new',
            salary: 200000,
            equity: true,
            company_handle: "newcompany"
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
        salary: 200000,
        equity: true,
        company_handle: "newcompany"
  };

  test("works", async function () {
    let job1 = await Job.update("new", updateData);
    expect(job1).toEqual({
      title: "new",
      ...updateData
    });

    const result = await db.query(
      `SELECT title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'new'`);
    expect(result.rows).toEqual([{
            title: 'new',
            salary: 200000,
            equity: true,
            company_handle: "newcompany"
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      salary: null,
    };

    let job2 = await Job.update("new", updateDataSetNulls);
    expect(job2).toEqual({
      title: "new",
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'new'`);
    expect(result.rows).toEqual([{
      title: "new",
      salary: null,
      equity: true,
      company_handle: "newcompany",
    }]);

  test("not found if no such company", async function () {
    try {
      await Job.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update("new", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove("new");
    const res = await db.query(
      "SELECT title FROM jobs WHERE title='new'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
});