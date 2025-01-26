import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';

const Order = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);

    const [orderData, setOrderData] = useState([])

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null
            }

            const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
            if (response.data.success) {
                let allOrdersItem = []
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status
                        item['payment'] = order.payment
                        item['paymentMethod'] = order.paymentMethod
                        item['date'] = order.date
                        allOrdersItem.push(item)
                    })
                })
                setOrderData(allOrdersItem.reverse())
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        loadOrderData()
    }, [token])

    return (
        <div className="p-6">
            <h2 className="pb-2 mb-4 text-2xl font-semibold uppercase border-b ">
                <Title text1={"My"} text2={"Orders"} />
            </h2>
            <div>
                {
                    orderData.slice(0, 4).map((item, index) => (
                        <div key={index} className='flex flex-col gap-4 py-4 text-gray-700 border-t border-b md:flex-row md:items-center md:justify-between'>
                            <div className='flex items-start gap-6 text-sm'>

                                <img src={item.image[0]} alt="" className='w-16 sm:w-20' />
                                <div>
                                    <p className='font-semibold'>{item.name}</p>
                                    <div className='flex items-center gap-3 mt-3 text-base text-gray-500'>
                                        <p>{currency}{item.price}</p>
                                        <p>Quantity:{item.quantity}</p>
                                        <p>Size: {item.size}</p>
                                    </div>
                                    <p className='mt-2'>Date:<span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                                    <p className='mt-2'>Payment:<span className='text-gray-400'>{item.paymentMethod}</span></p>
                                </div>

                            </div>
                            <div className='flex justify-between md:w-1/2'>
                                <div className='flex items-center gap-3'>
                                    <p className='h-2 bg-green-500 rounded-full min-w-2'></p>
                                    <p className='text-sm md:text-base'>Ready to ship</p>
                                </div>
                                <button className="px-4 py-2 border rounded hover:bg-gray-100 ">  Track Order</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};


export default Order