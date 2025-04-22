import React, { useEffect, useState } from 'react'
import './Payment.css'
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { NumericFormat } from 'react-number-format';
import { getBasketTotal } from './reducer';
import axios from './axios';
import { useNavigate } from "react-router-dom";
import { db } from './firebase';
import instance from './axios';
import { collection, doc, setDoc } from 'firebase/firestore'; // Import modular methods



function Payment() {
  const [{basket, user},dispatch]=useStateValue();

  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  const navigate = useNavigate();
  
    useEffect(() => {
        // generate the special stripe secret which allows us to charge a customer
        const getClientSecret = async () => {

            const response = await instance({
              method: 'post',
              // Stripe expects total amount in the smallest currency unit (like cents)
              url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });

            setClientSecret(response.data.clientSecret);
            console.log('Stripe client secret:', response.data.clientSecret); // ✅ Correct log
        };

        getClientSecret();
    }, [basket]);

  console.log('THe secret is >>',clientSecret);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    const paymentIntent = payload.paymentIntent;

    const orderRef = doc(db, "users", user?.uid, "orders", paymentIntent.id);

    await setDoc(orderRef, {
      basket: basket,
      amount: paymentIntent.amount,
      created: paymentIntent.created,
    });

    setSucceeded(true);
    setError(null);
    setProcessing(false);

    dispatch({
      type: "EMPTY_BASKET",
    });

    navigate("/orders");
  };

  const handleChange = event=>{
    setDisabled(event.empty);
    setError(event.error ? event.error.message:"");
  }

  return (
    <div className='payment'>
      <div className='payment__container'>
        <h1>
          Checkout(
            <Link to="/checkout">{basket?.length} items</Link>
            )
        </h1>

        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Delivery address</h3>
          </div>
          <div className='payment__address'>
            <p>{user?.email}</p>
            <p>123 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>    
        </div>

        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Review item and delivery</h3>
          </div>
          <div className='payment__items'>
              {basket.map(item=>(
                <CheckoutProduct
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                />
            ))}
          </div>
        </div>

        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Payment Method</h3>
          </div>
          <div className='payment__details'>
            {/* stripe magic will go */}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange}/>
              <div className='payment__priceContainer'>
                <NumericFormat
                  renderText={(value)=>(
                    <h3>
                      Order Total: {value}
                    </h3>
                  )}
                  decimalScale = {2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={processing  || disabled || succeeded}>
                  <span>
                    {processing ? <p>Processing</p>:"Buy Now"}
                    </span>
                </button>
            </div>

            {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>        
    </div>
  )
}

export default Payment
