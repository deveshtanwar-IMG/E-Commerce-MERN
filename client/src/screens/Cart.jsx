import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import emptyCart from '../assets/images/element/cart.svg'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, deleteItemFromCart, removeItem} from '../redux/slices/cartSlice'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Cart = () => {

    const data = useSelector(state => state.cart)
    const [initialAmount, setInitialAmount] = useState(0)
    const discount = 4000;
    const dispatch = useDispatch()
    const userId = localStorage.getItem('userId')

    const addToCart = (payload) => {
        const cartData = {
            ...payload,
            quantity: 1
        }
        dispatch(addItem(cartData))
        axios.post('http://localhost:5001/set-cart-data', {
            ...cartData,
            userId: userId,
            quantity: payload.quantity+1
        })
    }

    const removeFromCart = (payload) => {
        dispatch(removeItem(payload))
        axios.post('http://localhost:5001/remove-cart-data', {...payload, quantity: payload.quantity - 1})

    }

    const deleteFromCart = (payload) => {
        dispatch(deleteItemFromCart(payload))
        axios.post('http://localhost:5001/delete-from-cart', payload)
    }
    
    useEffect(()=>{
        setInitialAmount(0)
        data.items.map((val)=>{
            const amount = val.price * val.quantity;
            setInitialAmount(initialAmount => initialAmount + amount)
        })
    },[data])

    return (
        <>
            {/* header */}
            <Header />
            <main>
                <section className="py-0">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="bg-light p-4 text-center rounded-3">
                                    <h1 className="m-0">My cart</h1>
                                    {/* <!-- Breadcrumb --> */}
                                    <div className="d-flex justify-content-center">
                                        <nav aria-label="breadcrumb">
                                            <ol className="breadcrumb breadcrumb-dots mb-0">
                                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                                <li className="breadcrumb-item"><a href="#">Products</a></li>
                                                <li className="breadcrumb-item active" aria-current="page">Cart</li>
                                            </ol>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {data.totalCount != 0 ?

                    <section className="pt-5">
                        <div className="container">

                            <div className="row g-4 g-sm-5">
                                {/* <!-- Main content START --> */}
                                <div className="col-lg-8 mb-4 mb-sm-0">
                                    <div className="card card-body p-4 shadow">
                                        <div className="table-responsive border-0 rounded-3">
                                            {/* <!-- Table START --> */}
                                            <table className="table align-middle p-4 mb-0">
                                                {/* <!-- Table head --> */}
                                                {/* <!-- Table body START --> */}
                                                <tbody className="border-top-0">

                                                    {data.items.map((val) => {
                                                        return (
                                                            <tr key={val._id}>
                                                                {/* <!-- Course item --> */}
                                                                <td>
                                                                    <div className="d-lg-flex align-items-center">
                                                                        {/* <!-- Image --> */}
                                                                        <div className="w-100px w-md-80px mb-2 mb-md-0">
                                                                            <img src={`http://localhost:8001/${val.image}`} className="rounded" alt="" />
                                                                        </div>
                                                                        {/* <!-- Title --> */}
                                                                        <h6 className="mb-0 ms-lg-3 mt-2 mt-lg-0">
                                                                            <a href="#">{val.title}</a>
                                                                        </h6>
                                                                    </div>
                                                                </td>
                                                                {/* <!-- Amount item --> */}
                                                                <td>
                                                                    <h5 className="text-success mb-0">{val.price} Rs </h5>
                                                                </td>
                                                                {/* <!-- Action item --> */}
                                                                <td>
                                                                    <div className='d-flex justify-content-evenly p-1 align-items-center' style={{ border: '1px solid lightgreen' }}>
                                                                        <button className="btn btn-sm btn-danger-soft px-2 mb-0" onClick={() => { removeFromCart(val) }}><i className="">-</i></button>
                                                                        <span className="h6 mb-0" style={{ padding: "5px" }}>{val.quantity}</span>
                                                                        <p className="btn btn-sm btn-success-soft px-2 me-1 mb-1 mb-md-0" onClick={() => { addToCart(val) }}><i className="">+</i></p>
                                                                        <div className='d-flex justify-content-center mt-1'>
                                                                            <button className="btn btn-sm btn-danger-soft px-2 mb-0" onClick={() => { deleteFromCart(val) }}><i className="fas fa-fw fa-times"></i></button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- Main content END --> */}

                                {/* <!-- Right sidebar START --> */}
                                <div className="col-lg-4">
                                    {/* <!-- Card total START --> */}
                                    <div className="card card-body p-4 shadow">
                                        {/* <!-- Title --> */}
                                        <h4 className="mb-3">Cart Total</h4>

                                        {/* <!-- Price and detail --> */}
                                        <ul className="list-group list-group-borderless mb-2">
                                            <li className="list-group-item px-0 d-flex justify-content-between">
                                                <span className="h6 fw-light mb-0">Original Price</span>
                                                <span className="h6 fw-light mb-0 fw-bold">Rs {initialAmount}</span>
                                            </li>
                                            <li className="list-group-item px-0 d-flex justify-content-between">
                                                <span className="h6 fw-light mb-0">Coupon Discount</span>
                                                <span className="text-danger">Rs {discount}</span>
                                            </li>
                                            <li className="list-group-item px-0 d-flex justify-content-between">
                                                <span className="h5 mb-0">Total</span>
                                                <span className="h5 mb-0">Rs {initialAmount - discount}</span>
                                            </li>
                                        </ul>

                                        {/* <!-- Button --> */}
                                        <div className="d-grid">
                                            <Link to="/checkout" className="btn btn-lg btn-success">Proceed to Checkout</Link>
                                        </div>

                                        {/* <!-- Content --> */}
                                        <p className="small mb-0 mt-2 text-center">By completing your purchase, you agree to these <a href="#"><strong>Terms of Service</strong></a></p>

                                    </div>
                                    {/* <!-- Card total END --> */}
                                </div>
                                {/* <!-- Right sidebar END --> */}

                            </div>
                        </div>
                    </section>
                    :
                    <section>
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center">
                                    {/* <!-- Image --> */}
                                    <img src={emptyCart} className="h-200px h-md-300px mb-3" alt="" />
                                        {/* <!-- Subtitle --> */}
                                        <h2>Your cart is currently empty</h2>
                                        {/* <!-- info --> */}
                                        <p className="mb-0">Please check out all the available courses and buy some courses that fulfill your needs.</p>
                                        {/* <!-- Button --> */}
                                        <Link to="/home" className="btn btn-primary mt-4 mb-0">Back to Shop</Link>
                                </div>
                            </div>
                        </div>
                    </section>
                }
            </main>

            {/* Footer */}
            <Footer />
        </>
    )
}

export default Cart;