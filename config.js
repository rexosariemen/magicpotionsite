/**
 * 1. dB string
 * 2. newOrderLegibility module
 */
module.exports = {
  mongoUrl: 'mongodb+srv://rexosariemen:curologyTH@cluster0.5rtaa.mongodb.net/<dbname>?retryWrites=true&w=majority',
  newOrderLegible: (prevOrders, curOrder) => {


    
    return prevOrders.map(prevOrder => {
      const legibility = true;
      const { 
        email: prevOrderEmail, quantity: prevQuantity, orderDate: prevOrdDate,
        address: prevAddress } = prevOrder;
      const {
        email: curOrderEmail, quantity: curQuantity, orderDate: curOrdDate,
        address: curAddress } = curOrder;
      
      const sameUser = prevOrderEmail === curOrderEmail;
  
      // Check legibility of user to make new orders
      if (!sameUser) {
        return legibility;
      } else if (sameUser) {
        if (monthPassed(prevOrdDate, curOrdDate) || (prevQuantity + curQuantity <= 3)) {
          return legibility;
        } else if (!sameAddress(prevAddress, curAddress)) {
          return legibility;
        } else {
          return false //change this to false
        }
      }
      // return legibility;
    })[0];
  }
}

// Compare address objects
function sameAddress(prevOrderAddress, curOrderAddress) {
  // shallow comparison of values in address objects
   return JSON.stringify(Object.values(prevOrderAddress)) === 
          JSON.stringify(Object.values(curOrderAddress))
}

// Check to see if 28days(min days in a month) has passed since the last order
function monthPassed(prevOrdDate, curOrdDate) {
  return curOrdDate - prevOrdDate >= 2419200000;
}