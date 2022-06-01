const { fetchApiJson } = require("../models/api");

exports.getApiJson = (req, res, next) => {
  fetchApiJson().then((endpoints) => {
    res.status(200).send({endpoints});
  });
};
