import React, { Component } from 'react';
import { validate } from '../formValidation';
import axios from 'axios';

const imageUrl = 'https://cdna.artstation.com/p/assets/images/images/009/838/868/large/anna-emelyanova-bottle-3.jpg?1521148475';

class ContactComponent extends Component {

    initialState = {
      quantity: '',
      total: '',
      firstName: '',
      lastName: '',
      address: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: '',
      },
      email: '',
      phoneNumber: '',
      payment: {
        ccNum: '',
        exp: '',
      },
      touched: {
        quantity: false,
        total: false,
        firstName: false,
        lastName: false,
        phoneNumber: false,

      },
      exceedMaxQuantiy: '',
      completeFields: ''
    }
    state = this.initialState;
    errors = {};
    successOrder = 'none-display';
    badOrder = 'node-display';
    incompleteFields = 'none-display';

  handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      this.setState({
        [name]: value,
        total: (49.99 * value).toString(),
      })
    } else if (Object.keys(this.state.address).includes(name)) {
      this.setState({
        address: { ...this.state.address, [name]: value },
      })
    } else if (Object.keys(this.state.payment).includes(name)) {
      this.setState({
        payment: { ...this.state.payment, [name]: value },
      })
    } else {
      this.setState({
        [name]: value,
      })
    }
    this.successOrder = 'none-display';
    this.badOrder = 'none-display';
    this.incompleteFields = 'none-display';
  }

  handleFormReset = () => {
    this.setState(() => this.initialState)
  }

  isErrors = (array) => array.every(el => el === "");

  handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      address: this.state.address,
      phone: this.state.phoneNumber,
      quantity: this.state.quantity,
      total: this.state.total,
      payment: this.state.payment
    }
    const formValues = Object.values(formData);
    console.log(formValues);


    if (this.isErrors(Object.values(this.errors))) { //!flip this to undo testing
      axios.post('/magic', formData)
      .then(() => {
        this.handleFormReset();
        this.successOrder = 'success-order';
        this.forceUpdate();
      })
      .catch(err => {
        if (err.response.status === 400) {
          this.badOrder = 'bad-order';
          this.setState({
            exceedMaxQuantiy: '!! Order of more than 3 magic potions cannot be made by the same client for a given month!' 
          });
        } else if (err.response.status === 500) {
          this.incompleteFields = 'bad-order';
           this.setState({
            completeFields: '!! Please complete the fields before submitting your order!' 
          });
        } else {
          this.handleFormReset();
          this.successOrder = 'success-order';
        }
        console.log(`Server Errors: ${err.response.status}:${err.response.statusMessage}`);
      });
    }
  }

  handleBlur = (field) => () => {
    this.setState({
      touched: { ...this.state.touched, [field]: true }
    });
  }

  // componentDidUpdate() {
  //     this.errors = validate(
  //     this.state, this.state.quantity, this.state.firstName, this.state.lastName, 
  //     this.state.address.street1, this.state.address.city, 
  //     this.state.address.state, this.state.address.zip,
  //     this.state.email, this.state.phoneNumber, this.state.ccNum,
  //     this.state.exp
  //   );
  // }
  
  render() {

    this.errors = validate(
      this.state, this.state.quantity, this.state.firstName, this.state.lastName, 
      this.state.address.street1, this.state.address.city, 
      this.state.address.state, this.state.address.zip,
      this.state.email, this.state.phoneNumber, this.state.ccNum,
      this.state.exp
    );

    return (
      <div className='main'>
        <form className='form' 
          onSubmit={this.handleSubmit}>
          <div className='magic'>
            <h3>Magic Potion</h3>
            <div className='potion'>
              <div className='img-div'>
              <img src={imageUrl} height="150" alt='potionImage'></img>
              </div>
              <div className='quantity'>
                <label htmlFor="quantity">Qty&nbsp;&nbsp;</label>
                <input type="number" id="quantity" name="quantity" max='3'
                  value={this.state.quantity}
                  invalid={this.errors.quantity}
                  onBlur={this.handleBlur('quantity')}
                  onChange={this.handleChange}
                >
                </input>
                <em className="form-errors">{this.errors.quantity}</em>
                <label htmlFor="total">Total</label>
                <input type='text' id="total" name="total" 
                  value={this.state.total} readOnly
                />
              </div>
            </div>
          </div>

          <div className='contact-info'>
            <h4 className={this.successOrder}>Your order has been placed!</h4>
            <h4 className={this.badOrder}>{this.state.exceedMaxQuantiy}</h4>
            <h4 className={this.incompleteFields}>{this.state.completeFields}</h4>
            <h3>Contact | Billing Information</h3>
            <div className='name'>
              <input type='text/plain' name='firstName' placeholder='First Name'
                value={this.state.firstName}
                invalid={this.errors.firstName}
                onBlur={this.handleBlur('firstName')}
                onChange={this.handleChange} />
                <em className='form-errors'>{this.errors.firstName}</em>
              <input type='text/plain' name='lastName' placeholder='Last Name'
                value={this.state.lastName}
                invalid={this.errors.lastName}
                onBlur={this.handleBlur('lastName')}
                onChange={this.handleChange} />
                <em className='form-errors'>{this.errors.lastName}</em>
            </div>
            
            <div className='street1'>
              <input type='text/plain' name='street1' 
              placeholder='Address Line 1'
                value={this.state.address.street1}
                invalid={this.errors.add1}
                onBlur={this.handleBlur('street1')}
                onChange={this.handleChange} />
                <em className='form-errors'>{this.errors.add1}</em>
              <input type='text/plain' name='street2' 
                placeholder='Address Line 2'
                value={this.state.address.street2}
                onChange={this.handleChange} />
            </div>
            <div className='street2'>
              <input type='text/plain' name='city' 
                placeholder='City'
                value={this.state.address.city}
                invalid={this.errors.city}
                onBlur={this.handleBlur('city')}
                onChange={this.handleChange} />
                <em className='form-errors'>{this.errors.city}</em>
              <select name='state'
                value={this.state.address.state}
                invalid={this.errors.state}
                onBlur={this.handleBlur('state')}
                onChange={this.handleChange} >
                <option value=''>State</option>
                <option value='CA'>CA</option>
                <option value='NY'>NY</option>
                <option value='MO'>MO</option>
                <option value='NJ'>NJ</option>
                <option value='MA'>MA</option>
              </select>
              <em className='form-errors'>{this.errors.state}</em>
              <input type='text/plain' name='zip' 
                placeholder='Zip Code'
                value={this.state.address.zip}
                invalid={this.errors.zip}
                onBlur={this.handleBlur('zip')}
                onChange={this.handleChange} />
                <em className='form-errors'>{this.errors.zip}</em>
            </div>
            <div className='contact'>
              <input type='text/plain' name='email' 
                placeholder='Email Address'
                value={this.state.email}
                invalid={this.errors.email}
                onBlur={this.handleBlur('email')}
                onChange={this.handleChange} />
                <em className='form-errors'>{this.errors.email}</em>
              <input type='text/plain' name='phoneNumber' 
                placeholder='Phone Number'
                value={this.state.phoneNumber}
                invalid={this.errors.phoneNumber}
                onBlur={this.handleBlur('phoneNumber')}
                onChange={this.handleChange} />
                <em className='form-errors'>{this.errors.phoneNumber}</em>
            </div>
            
            <div className='creditCard'>
              <input type='text/plain' name='ccNum'
                placeholder='Credit Card Number'
                value={this.state.payment.ccNum}
                invalid={this.errors.ccNum}
                onBlur={this.handleBlur('ccNum')}
                onChange={this.handleChange} />
                <em className='form-errors'>{this.errors.ccNum}</em>
              <input type='text/plain' name='exp'
                placeholder='mm/yy'
                value={this.state.payment.exp}
                invalid={this.errors.exp}
                onBlur={this.handleBlur('exp')}
                onChange={this.handleChange} />
                <em className='form-errors'>{this.errors.exp}</em>
            </div>
            <div className='submitButton'>
              <input type='submit' />
            </div>
          </div>
        </form>
      </div>  
    )
  };
}

export default ContactComponent;