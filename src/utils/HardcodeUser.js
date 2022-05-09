module.exports.HardcodeUser = (req, res, next) => {
  req.user = {
    _id: '6277b4bf607fa1b0429f0092'
  };

  next();
};