import Header from '../components/Header'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { clearCart, deleteItemFromCart } from '../redux/slices/cartSlice'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { formValidation } from '../schema/order'
import { getAPI, postAPIAuth } from '../services/api'

const Checkout = () => {

    const [initialAmount, setInitialAmount] = useState(0)
    const [formData, setFormData] = useState(null)
    const [discount, setDiscount] = useState(4000)
    const dispatch = useDispatch()
    const data = useSelector(state => state.cart)
    const [state, setState] = useState('')
    const [key, setKey] = useState('')
    const navigation = useNavigate()
    const userId = localStorage.getItem('userId')

    const initialValues = {
        name: '',
        email: '',
        phone: '',
        postal_code: '',
        address: ''
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: formValidation,
        onSubmit: (values, action) => {
            const orderData = {
                ...values,
                state: state
            }
            setFormData(orderData)
            action.resetForm();
        }
    })

    useEffect(() => {
        setInitialAmount(0)
        data.items.map((val) => {
            const amount = val.price * val.quantity;
            setInitialAmount(initialAmount => initialAmount + amount)
        })
    }, [data])

    const deleteFromCart = (payload) => {
        const cartData = {
            ...payload,
            product_id : payload.product_id
        }
        delete cartData._id;
        dispatch(deleteItemFromCart(cartData))
        postAPIAuth('delete-from-cart', cartData)
    }

    const paymentHandler = async () => {
        const { data } = await postAPIAuth('generate-order-id', {amount: initialAmount - discount})
        const RAZORPAY_KEY = await getAPI('get-key')
        setKey(RAZORPAY_KEY.data.key)
        initPay(data.data)
    }

    const initPay = (orderData) => {
        const options = {
            key: key,
            amount: orderData.amount / 100,
            currency: orderData.currency,
            name: 'E-commerce MERN',
            description: "This is created by DEVESH TANWAR",
            image: 'https://www.onlinelogomaker.com/blog/wp-content/uploads/2017/06/shopping-online.jpg',
            order_id: orderData.id,
            handler: async (response) => {
                try {
                    const { data } = await postAPIAuth('verify-payment', response)
                    if (data.success) {
                        postAPIAuth('empty-cart', {})
                        postAPIAuth('shipping-details', { ...formData, data, userId, orderData})
                        navigation('/orders')
                        dispatch(clearCart())
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#3399cc",
            },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    return (
        <>
            {/* Header  */}
            <Header />
            <section className="py-0">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="bg-light p-4 text-center rounded-3">
                                <h1 className="m-0">Checkout</h1>
                                {/* <!-- Breadcrumb --> */}
                                <div className="d-flex justify-content-center">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb breadcrumb-dots mb-0">
                                            <li className="breadcrumb-item"><a href="#">Home</a></li>
                                            <li className="breadcrumb-item"><a href="#">Courses</a></li>
                                            <li className="breadcrumb-item"><a href="#">Cart</a></li>
                                            <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-5">
                <div className="container">

                    <div className="row g-4 g-sm-5">
                        {/* <!-- Main content START --> */}
                        <div className="col-xl-8 mb-4 mb-sm-0">
                            {/* <!-- Personal info START --> */}
                            <div className="card card-body shadow p-4">
                                <div className="row g-3 mt-4">
                                    {/* <!-- Title --> */}
                                    <h5 className="">Shipping Details</h5>
                                    {/* <!-- Form START --> */}
                                    <form className="row g-3 mt-0" onSubmit={handleSubmit}>
                                        {/* <!-- Name --> */}
                                        <div className="col-md-6 bg-light-input">
                                            <label htmlFor="yourName" className="form-label">Your name *</label>
                                            <input type="text" className="form-control" id="yourName" placeholder="Name" name='name'
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur} />
                                            {errors.name && touched.name ? <p style={{ color: 'red' }}>{errors.name}</p> : null}
                                        </div>
                                        {/* <!-- Email --> */}
                                        <div className="col-md-6 bg-light-input">
                                            <label htmlFor="emailInput" className="form-label">Email address *</label>
                                            <input type="email" className="form-control" id="emailInput" placeholder="Email" name='email'
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur} />
                                            {errors.email && touched.email ? <p style={{ color: 'red' }}>{errors.email}</p> : null}
                                        </div>
                                        {/* <!-- Number --> */}
                                        <div className="col-md-6 bg-light-input">
                                            <label htmlFor="mobileNumber" className="form-label">Mobile number *</label>
                                            <input type="text" className="form-control" id="mobileNumber" placeholder="Mobile number" name='phone'
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                maxLength={12} />
                                            {errors.phone && touched.phone ? <p style={{ color: 'red' }}>{errors.phone}</p> : null}
                                        </div>
                                        {/* <!-- Country option --> */}
                                        <div className="col-md-6 bg-light-input">
                                            <label htmlFor="mobileNumber" className="form-label">Select country *</label>
                                            <select className="form-select js-choice" aria-label=".form-select-lg" disabled>
                                                <option>India</option>
                                            </select>
                                        </div>
                                        {/* <!-- State option --> */}
                                        <div className="col-md-6 bg-light-input">
                                            <label htmlFor="mobileNumber" className="form-label">Select state *</label>
                                            <select className="form-select js-choice" aria-label=".form-select-lg" required onChange={(e) => { setState(e.target.value) }}>
                                                <option value="">Select state</option>
                                                <option value="Maharashtra">Maharashtra</option>
                                                <option value="Delhi">Delhi</option>
                                                <option value="Punjab">Punjab</option>
                                                <option value="Rajasthan">Rajasthan</option>
                                                <option value="Gujrat">Gujrat</option>
                                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                            </select>
                                        </div>
                                        {/* <!-- Postal code --> */}
                                        <div className="col-md-6 bg-light-input">
                                            <label htmlFor="postalCode" className="form-label">Postal code *</label>
                                            <input type="text" className="form-control" id="postalCode" placeholder="PIN code" name='postal_code'
                                                value={values.postal_code}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                maxLength={10} />
                                            {errors.postal_code && touched.postal_code ? <p style={{ color: 'red' }}>{errors.postal_code}</p> : null}
                                        </div>
                                        {/* <!-- Address --> */}
                                        <div className="col-md-6 bg-light-input">
                                            <label htmlFor="address" className="form-label">Address *</label>
                                            <input type="text" className="form-control" id="address" placeholder="Address" name='address'
                                                value={values.address}
                                                onChange={handleChange}
                                                onBlur={handleBlur} />
                                            {errors.address && touched.address ? <p style={{ color: 'red' }}>{errors.address}</p> : null}
                                        </div>
                                        {/* <!-- Button --> */}
                                        <div className="col-12 text-end">
                                            <button type="submit" className="btn btn-primary mb-0" >Save</button>
                                        </div>
                                    </form>
                                    {/* <!-- Form END --> */}
                                </div>
                            </div>
                        </div>
                        {/* <!-- Main content END --> */}

                        {/* <!-- Right sidebar START --> */}
                        <div className="col-xl-4">
                            <div className="row mb-0">
                                <div className="col-md-6 col-xl-12">
                                    {/* <!-- Order summary START --> */}
                                    <div className="card card-body shadow p-4 mb-4">
                                        {/* <!-- Title --> */}
                                        <h4 className="mb-4">Order Summary</h4>
                                        {data.items.map((val) => {
                                            return (
                                                <div className="row g-3" key={val._id}>
                                                    {/* <!-- Image --> */}
                                                    <div className="col-sm-4">
                                                        <img className="rounded" src={`http://localhost:8001/${val.image}`} alt="" />
                                                    </div>
                                                    {/* <!-- Info --> */}
                                                    <div className="col-sm-8">
                                                        <h6 className="mb-0"><a href="#">{val.title}</a></h6>
                                                        <p className="mb-0"><a href="#"> Quantity : {val.quantity}</a></p>
                                                        {/* <!-- Info --> */}
                                                        {/* <!-- Price --> */}
                                                        <span className="text-success">{val.price} Rs</span>
                                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                                            {/* <!-- Remove and edit button --> */}
                                                            <div className="text-primary-hover">
                                                                <Link className="text-body me-2" onClick={() => { deleteFromCart(val) }}><i className="bi bi-trash me-1"></i>Remove</Link>
                                                                <Link to="/cart" className="text-body me-2"><i className="bi bi-pencil-square me-1"></i>Edit</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr />
                                                </div>
                                            )
                                        })}

                                        <hr />

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
                                            <button className="btn btn-lg btn-success" disabled={initialAmount === 0 || formData == null} onClick={paymentHandler}>Place Order</button>
                                        </div>

                                        {/* <!-- Content --> */}
                                        <p className="small mb-0 mt-2 text-center">By completing your purchase, you agree to these <a href="#"><strong>Terms of Service</strong></a></p>

                                    </div>
                                    {/* <!-- Order summary END --> */}
                                </div>
                            </div>
                        </div>
                        {/* <!-- Right sidebar END --> */}
                    </div>
                </div >
            </section >
            {/* Footer */}
            < Footer />
        </>
    )
}

export default Checkout;