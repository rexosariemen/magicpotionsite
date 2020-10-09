/**
 * Set up Schema for magicPotion
 */
const Mongoose = require('mongoose');

const Schema = require('mongoose').Schema;

const magicPotionSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    street1: {
      type: String,
      required: true
    },
    street2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    }
  },
  phone: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  total: {
    type: String
  },
  orderDate: {
    type: Date,
    default: new Date()
  },
  fulfilled: {
    type: Boolean,
    default: false
  },
  payment: {
    ccNum: {
      type: String,
      required: true,
    },
    exp: {
      type: String,
      required: true
    }
  },
}, {
  timestamps: true,
});

module.exports = Mongoose.model('MagicPotion', magicPotionSchema);