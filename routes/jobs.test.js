"use strict";

const request = require("supertest");


const db = require("../db");
const app = require("../app");

const {
    adminToken,
    u2Token,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /companies */
describe("POST /jobs", function () {
  test("ok for admin", async function () {
    const resp = await request(app)
      .post(`/jobs`)
      .send({
        company_handle: "c1",
        title: "J-new",
        salary: 10,
        equity: "0.2",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        title: "J-new",
        salary: 10,
        equity: "0.2",
        company_handle: "c1",
      },
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
      .post(`/jobs`)
      .send({
        companyHandle: "c1",
        title: "J-new",
        salary: 10,
        equity: "0.2",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post(`/jobs`)
      .send({
        companyHandle: "c1",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post(`/jobs`)
      .send({
        companyHandle: "c1",
        title: "J-new",
        salary: "not-a-number",
        equity: "0.2",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

});
// describe("POST /jobs", function () {
//   const newJob = {
//     title: 'new4',
//     salary: 200000,
//     equity: "0",
//     company_handle: "c1"
//   };

//   test("ok for users", async function () {
//     const resp = await request(app)
//         .post("/jobs")
//         .send(newJob)
//         .set("authorization", `Bearer ${u1Token}`);
//     // expect(resp.statusCode).toEqual(201);
//     expect(resp.body).toEqual({
//       job: newJob
//     });
//   });
//     expect(resp.statusCode).toEqual(400);
//   });
//   test("bad request with missing data", async function () {
//     const resp = await request(app)
//         .post("/jobs")
//         .send({
//           title: "new",
//           salary: 10,
//         })
//         .set("authorization", `Bearer ${ u1Token }`);

//   test("bad request with invalid data", async function () {
//     const resp = await request(app)
//         .post("/companies")
//         .send({
//           ...newJob,
//           equity: "not-a-url",
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(400);
//   });
//});
