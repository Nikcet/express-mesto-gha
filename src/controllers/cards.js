const card = require("../schemas/cardSchema");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: "Не создалась карточка в базе." }));
};


module.exports.getCards = (req, res) => {
  card.find({})
    .populate("owner")
    .then(cards => res.send({ cardList: cards }))
    .catch(err => res.status(500).send({ message: "Не пришел список карточек из базы." }));
}


module.exports.deleteCard = (req, res) => {
  user.findById(req.params.id)
    .then(card => res.send({ card }))
    .catch(err => res.status(500).send({ message: "Не удалилась карточка из базы." }));
}