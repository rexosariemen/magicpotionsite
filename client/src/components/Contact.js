import React, { Component } from 'react';
import { validate } from './formValidation';
import axios from 'axios';

const imageUrl = 'https://cdna.artstation.com/p/assets/images/images/009/838/868/large/anna-emelyanova-bottle-3.jpg?1521148475';

class ContactComponent extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
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

      }
    }
    this.state = this.initialState;
    this.errors = {};
    this.successOrder = 'none-display';
  }

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
    // this.handleChange(e);
    // console.log('errorObj: ', this.errors);
    // console.log(this.isErrors(Object.values(this.errors)));
    // console.log(`state: ${JSON.stringify(this.state)}`)
    if (!this.isErrors(Object.values(this.errors))) {
      axios.post('/magic', formData)
      .then(res => res.json())
      .then(data => {
        console.log('this is the data in res Object: ', data);
      })
      .catch(err => {
        console.log('An error has occurred: ', err);
      });
      this.handleFormReset();
      this.successOrder = 'success-order';
    }
  }

  handleBlur = (field) => () => {
    this.setState({
      touched: { ...this.state.touched, [field]: true }
    });
  }
  
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
                <input type="number" id="quantity" name="quantity" max='3' required
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
            
            <div className='addresses'>
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
            <div className='add2'>
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
              <input type='text/plain' name='ccNum' required
                placeholder='Credit Card Number'
                value={this.state.ccNum}
                invalid={this.errors.ccNum}
                onBlur={this.handleBlur('ccNum')}
                onChange={this.handleChange} />
                <em className='form-errors'>{this.errors.ccNum}</em>
              <input type='text/plain' name='exp' 
                placeholder='mm/yy' required
                value={this.state.exp}
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