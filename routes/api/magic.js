const express = require('express');
const MagicPotion = require('../../models/magicPotion');
const magicPotionRouter = express.Router();
const newOrderLegible = require('../../config').newOrderLegible;


magicPotionRouter.route('/')
.get((req, res, next) => {
  // Todo: remove this endpoint! Use only for testing
  MagicPotion.find()
  .then(potions => {
    console.log('req.body: ', req.body)
    console.log('here at /magic get endpoint!')
    res.statusCode = 200 || 201;
    res.setHeader('Content-Type', 'application/json');
    res.json(potions);
  })
  .catch(err => next(err));
})
.post((req, res, next) => {
  MagicPotion.find()
  .then(potions => {
    console.log('req.body: ', req.body)
    // only post new order if user is eligible for new order;
    const legibility = newOrderLegible(potions, req.body);
    console.log('Leg: ', legibility);
    if (legibility) {
      console.log('here at /magic post endpoint!')
      MagicPotion.create(req.body)
      .then(potion => {
      console.log('Potion create: ', potion);
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.json({id: potion._id});
      }).catch(err => next(err));
    } else {
      res.statusCode = 404;
      res.statusMessage = legibility
      res.json(res.statusMessage);
    }
  })
  .catch(err => next(err));
});

// @Params
magicPotionRouter.route('/:potionId')
.get((req, res, next) => {
  MagicPotion.findById(req.params.potionId)
  .then(potion => {
    console.log('potion: ', potion)
    if (potion) {
      res.statusCode = 201;
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
      res.statusCode = 200;
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
  MagicPotion.findByIdAndUpdate(req.params.potionId)
  .then(response => {
    if (response) {
      res.statusCode = 200;
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

/**
 * {
"firstName": "Me", "lastName": "string", "email": "string", "address": {
"street1": "address", "street2": "string", "city": "string", "state": "string", "zip": "string"
},
"phone": "string", "quantity": 2, "total": "$199.80", "payment": {
"ccNum": "string",
"exp": "string" }
}
 */