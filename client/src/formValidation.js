/**
 * Form validation module
 */
// const required = val => val && val.length;
// const maxLength = len => val => !val || (val.length <= len);
// const minLength = len => val => val && (val.length >= len);
const isNumber = val => !isNaN(+val);
const validEmail = val => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);

export const validate = (
  stateObj, quantity, fName, lName, add1, city, state, zip, email, phoneNumber, card, exp
  ) => {
  const errors = {
    quantity: '',
    firstName: '',
    lastName: '',
    add1: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phoneNumber: '',
    ccNum: '',
    exp: '',
  };

  if (stateObj.touched.quantity) {
    if (!isNumber(quantity)) errors.quantity = 'Quantity of potion must be a number.';
    if (quantity < 1) errors.quantity = 'Must add at least 1 Potion.';
    if (quantity > 3) errors.quantity = 'Only maximum of 3 potions are allowed.'
  }

  if (stateObj.touched.firstName) {
    if (fName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters.';
    } else if (fName.length > 15) {
      errors.firstName = 'First name must be 15 or less characters.';
    }
  }
  if (stateObj.touched.lastName) {
    if (lName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters.';
    } else if (lName.length > 15) {
      errors.lastName = 'Last name must be 15 or less characters.';
    }
  }

  // address line 1
  if (stateObj.touched.street1) {
    if (stateObj.address.street1.split(' ').length < 3) {
      errors.add1 = 'Please provide a valid street address.';
    } 
  }

  // city
  if (stateObj.touched.city) {
    if (city.length < 2) {
      errors.city = 'Please provide a valid city name.';
    } 
  }

  // state
  if (stateObj.touched.state) {
    if (!state) errors.state = 'Select your state.'
  }

  // validation for zip code
  if (stateObj.touched.zip) {
    if (!isNumber(zip)) errors.zip = 'Zip Code should be a number.'
    if (zip.length < 5 || zip.length > 5) errors.zip = 'Invalid Zip Code.'
  }

  // email address validation
  if (stateObj.touched.email) {
    if (!validEmail(email)) errors.email = 'Please provide a valid email address.'
  }

  const reg1 = /(?:(?:(\s*\(?([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\)?\s*(?:[.-]\s*)?)([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})/
  // const reg = /^[0-9+()#.\sext-]+$/;
  if (stateObj.touched.phoneNumber && (!reg1.test(phoneNumber) )) {
    errors.phoneNumber = 'Please use only valid phone characters: digits, parenthesis, dashes, plus, space, pound, asterisk, period, comma, or the letters e, x, t.';
  }

  // validate cardNumber
  if (stateObj.touched.ccNum) {
    const card = stateObj.payment.ccNum;
    if (!card) {
      errors.ccNum = 'Please provide your card number.'
    } else if (!validCard(card)) {
      errors.ccNum = 'Please enter a valid card number.'
    }
  }

  // validate expiration
  if (stateObj.touched.exp) {
    const expDate = stateObj.payment.exp;
    if (!expDate) { 
      errors.exp = 'Please provide the expiration date on your card';
    } else
    if (validateExpiryDate(expDate) !== true) {
      errors.exp += validateExpiryDate(expDate);
    };
  }
  return errors;
}



// Card Types Check to validate payment card:
function AmexCardnumber(inputtxt) {
  var cardno = /^(?:3[47][0-9]{13})$/;
  return cardno.test(inputtxt);
}

function VisaCardnumber(inputtxt) {
  var cardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  return cardno.test(inputtxt);
}

function MasterCardnumber(inputtxt) {
  var cardno = /^(?:5[1-5][0-9]{14})$/;
  return cardno.test(inputtxt);
}

function DiscoverCardnumber(inputtxt) {
  var cardno = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
  return cardno.test(inputtxt);
}

function DinerClubCardnumber(inputtxt) {
  var cardno = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
  return cardno.test(inputtxt);
}

function JCBCardnumber(inputtxt) {
  var cardno = /^(?:(?:2131|1800|35\d{3})\d{11})$/;
  return cardno.test(inputtxt);
}

function validCard(cardNumber) {

  var cardType = null;
  if (VisaCardnumber(cardNumber)) {
    cardType = "visa";
  } else if (MasterCardnumber(cardNumber)) {
    cardType = "mastercard";
  } else if (AmexCardnumber(cardNumber)) {
    cardType = "americanexpress";
  } else if (DiscoverCardnumber(cardNumber)) {
    cardType = "discover";
  } else if (DinerClubCardnumber(cardNumber)) {
    cardType = "dinerclub";
  } else if (JCBCardnumber(cardNumber)) {
    cardType = "jcb";
  }

  // console.log('cardType: ', cardType);
  if (!cardType) return false;

  return true;
}

// To validate card expiration:
function validateExpiryDate(s) {

  // Check 2/2 digits format
  if (!/\d\d\/\d\d/.test(s)) {
    return 'Expiry date format must be MM/YY';
  }

  // Check month is 1 to 12 inclusive
  var b = s.split('/');
  if (b[0] < 1 || b[0] > 12) {
    return 'Expiry month must be from 00 to 12';
  }

  // Check is this month or later
  var d = new Date()
  var c = d.getFullYear() / 100 | 0 + '';
  if (new Date(c + b[1], b[0], 1) < d) {
    return 'Expiry date must be this month or later';
  }

  return true;
}