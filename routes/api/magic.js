const express = require('express');
const MagicPotion = require('../../models/magicPotion');
const magicPotionRouter = express.Router();
const { checkOrder } = require('../magicController/magic.js');


magicPotionRouter.route('/')
.get((req, res, next) => { //! For Development only, remove!
  MagicPotion.find()
  .then(potions => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(potions);
  })
  .catch(err => next(err));
})
.post(checkOrder, (req, res, next) => {
  const newOrderAllowed = res.locals.legibility;
  if (!newOrderAllowed) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'applicatoin/json');
    res.json({
      status: 'Fail',
      message: 'Order of more than 3 magic potions can not be made by the same client for a given month!'
    });
  } else {
    MagicPotion.create(req.body)
    .then(potion => {
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.json({id: potion._id});
    })
    .catch(err => next(err));
  }
})
.delete((req, res, next) => { //! For Development only, remove!
  MagicPotion.deleteMany()
  .then(response => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(err => next(err));
})

// @Params
magicPotionRouter.route('/:potionId')
.get((req, res, next) => {
  MagicPotion.findById(req.params.potionId)
  .then(potion => {
    if (potion) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(potion);
    } else {
      res.statusCode = 404;
      res.statusMessage = 'resource not found'
      res.json(res.statusMessage);
    }
  })
  .catch(err => next(err));
})
.patch((req, res, next) => {
  MagicPotion.findByIdAndUpdate(req.params.potionId, { $set: req.body },
    { new: true })
  .then(potion => {
    if (potion) {
      res.statusCode = 200 || 204;
      res.statusMessage = 'resource updated successfully';
      res.setHeader('Content-Type', 'application/json');
      res.json({ id: potion._id, fulfilled: potion.fulfilled });
    } else {
      res.statusCode = 404;
      res.statusMessage = 'resource not found.';
      res.setHeader('Content-Type', 'application/json');
      res.json(res.statusMessage);
    }
  })
  .catch(err => next(err))
})
.delete((req, res, next) => {
  MagicPotion.findByIdAndDelete(req.params.potionId)
  .then(response => {
    if (response) {
      res.statusCode = 200 || 204;
      res.statusMessage = 'resource deleted successfully..';
      res.setHeader('Content-Type', 'application/json');
      res.json(response)
    } else {
      res.statusCode = 404;
      res.statusMessage = 'resource not found';
      res.setHeader('Content-Type', 'application/json');
      res.json(res.statusMessage);
    }
  })
  .catch(err => next(err));
});

module.exports = magicPotionRouter;