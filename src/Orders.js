import React, { useEffect, useState } from 'react';
import './Orders.css';
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from './firebase';
import { useStateValue } from './StateProvider';
import Order from './Order';

function Orders() {
  const[{basket,user},dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);

 useEffect(() => {
   if (user) {
     const ordersRef = collection(db, "users", user.uid, "orders");
     const q = query(ordersRef, orderBy("created", "desc"));

     const unsubscribe = onSnapshot(q, (snapshot) =>
       setOrders(
         snapshot.docs.map((doc) => ({
           id: doc.id,
           data: doc.data(),
         }))
       )
     );

     // Clean up listener on unmount
     return () => unsubscribe();
   } else {
     setOrders([]);
   }
 }, [user]);

  return (
    <div className='orders'>
      <h1>Your Orders</h1>

      <div className='orders__order'>
        {orders?.map(order=>(
          <Order order = {order}/>
        ))}
        </div>
        
    </div>
  )
}

export default Orders
