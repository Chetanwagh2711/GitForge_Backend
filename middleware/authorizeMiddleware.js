function authorizeSelf(req, res, next) {
  if (String(req.user.id) !== String(req.params.id)) {
    return res
      .status(403)
      .json({ message: "You can only modify your own account." });
  }
  next();
}

module.exports = authorizeSelf;