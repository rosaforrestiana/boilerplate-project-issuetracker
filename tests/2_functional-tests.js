const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deleteID;
suite("Functional Tests", function() {
  suite("Routing Tests", function() {
    suite("3 Post request Tests", function() {
      test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .post("/api/issues/apitest")
        .set("content-type", "application/json")
        .send({
          issue_title: "Issue",
          issue_text: "Functional Test",
          created_by: "rose",
          assigned_to: "rose",
          status_text: "Not done"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          deleteID = res.body._id;
          assert.equal(res.body.issue_title, "Issue");
          assert.equal(res.body.assigned_to, "rose");
          assert.equal(res.body.status_text, "Not done");
          assert.equal(res.body.issue_text, "Functional Test");
          done();
        });
      });
      test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .post("/api/issues/apitest")
        .set("content-type", "application/json")
        .send({
          issue_title: "Issue",
          issue_text: "Functional Test",
          created_by: "rose",
          assigned_to: "",
          status_text: ""
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Issue");
          assert.equal(res.body.created_by, "rose");
          assert.equal(res.body.issue_text, "Functional Test");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
      });
      test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .post("/api/issues/apitest")
        .set("content-type", "application/json")
        .send({
          issue_title: "",
          issue_text: "",
          created_by: "rose",
          assigned_to: "",
          status_text: ""
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
      });
    });

    ///////////////// GET REQUESTS TESTS ////////////////

    suite("3 Get request Tests", function () {
      test("View issues on a project: GET request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .get("/api/issues/apitest")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 4);
          done();
        });
      });
      test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .get("/api/issues/apitest")
        .query({
          _id: "60245f4db710824be4eb9896",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body[0], {
            issue_title: "Test",
            issue_text: "Testing",
            created_on: "2021-02-10T22:33:49.550+00:00",
            updated_on: "2021-02-10T22:33:49.550+00:00",
            created_by: "rose",
            assigned_to: "rose",
            open: true,
            status_text: "Open"
          });
          done();
        });
      });
      test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .get("/api/issues/apitest")
        .query({
          issue_title: "Bug issue",
          issue_text: "Testing big"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body[0], {
            _id: "60245fd3b710824be4eb9899",
            issue_title: "Bug issue",
            issue_text: "Testing big",
            created_on: "2021-02-10T22:36:03.608+00:00",
            updated_on: "2021-02-10T22:36:03.608+00:00",
            created_by: "rose",
            assigned_to: "rose",
            open: true,
            status_text: "Open"
          });
          done();
        });
      });
    });

    ///////////////////// PUT REQUEST TESTS //////////////////////

    suite("5 Put request Tests", function () {
      test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .put("/api/issues/apitest")
          .send({
            _id: "60220762aa78ac4494f8c0f1",
            issue_title: "changed title"
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "60220762aa78ac4494f8c0f1");
            done();
          });
      });
      test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "60220762aa78ac4494f8c0f1",
          issue_title: "Random",
          issue_text: "Random text"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "60220762aa78ac4494f8c0f1");
          done();
        });
      });
      test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "60220762aa78ac4494f8c0f1",
          issue_title: "Update",
          issue_text: "update"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        };
      });
      test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "60220762aa78ac4494f8c0f1"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
      });
      test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "60220762aa78ac4494f8c0f16210",
          issue_title: "Update",
          issue_text: "updated"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
      });
    });

    ///////////////// DELETE REQUEST TESTS ///////////////////

    suite("3 DELETE request Tests", function () {
      test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          _id: deleteID
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body.result, "successfully deleted");
          done();
        });
      });
      test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          _id: "60206843aeb79335a895a37einvalid"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body.error, "could not delete");
          done();
        });
      });
      test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
      });
    });
  });
});
