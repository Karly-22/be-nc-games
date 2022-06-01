const { readFile } = require("fs/promises");

exports.fetchApiJson = () => {
  return readFile("./endpoints.json", "utf-8").then((endpoints) => {
    return JSON.parse(endpoints);
  });
};
