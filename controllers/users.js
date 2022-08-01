const { fetchUsers, fetchUser } = require("../models/users");

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUsername = (req, res, next) => {
  const { username } = req.params;

  fetchUser(username).then((user) => {
    res.status(200).send({ user });
  });
};
