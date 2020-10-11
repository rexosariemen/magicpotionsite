/**
 * check eligibility of order before saving!
 */
const MagicPotion = require('../../models/magicPotion');

checkOrder = (req, res, next) => {
  MagicPotion.find()
  .then(potions => {
    const newOrderLegible = newOrderEligibility(potions, req.body);
    res.locals.legibility = newOrderLegible;
    return next();
  }).catch(err => next(err));
}




function newOrderEligibility(prevOrders, curOrder) {
  // Extract properties from current Order object (req.body);
  let {
    email: curOrderEmail, quantity: curQuantity, orderDate: curOrdDate
  } = curOrder;
    
  // Use email to check for duplicate clients
  const sameUser = prevOrders.filter(order => order.email === curOrderEmail).length;
  if (!sameUser)  {
    return true;
  } //Check to make sure user is not exceeding 3 potions a month;
  else  return prevOrders.filter(order => order.email === curOrderEmail)
    .slice(-3) //past three orders, since it's 1minimum per order
    .filter(order => !monthPassed(order.orderDate, curOrdDate)) //past 1month only
    .map(ordersInPastMonth => ordersInPastMonth.quantity) // get quantities from each order
    .reduce((sumQuantity, n) => sumQuantity + n, curQuantity) <= 3 // is total <= 3?
}

  // Compare address objects
function sameAddress(prevAddress, curAddress) {
  // shallow comparison of values in address objects
   return JSON.stringify(Object.values(prevAddress)) === 
          JSON.stringify(Object.values(curAddress))
}

// Check to see if 28days(min days in a month) has passed since the last order
function monthPassed(prevOrdDate, curOrdDate) {
  const passed28days = new Date().setDate(new Date().getDate(curOrdDate)) - 
  new Date().setDate(new Date().getDate(prevOrdDate));

  return passed28days >= 2419200000;
}

// Export checkOrder middleware
module.exports = { checkOrder };