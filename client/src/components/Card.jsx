import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem} from "../redux/slices/cartSlice";
import axios from "axios";

const Card = (props) => {
    const { title, price, image, desc, _id } = props.data;
    const dispatch = useDispatch()
    const data = useSelector(state => state.cart)
    const isItemInCart = data.items.find(item => item._id === _id)
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
            quantity: isItemInCart ? isItemInCart.quantity+1 : 1
        })
    }

    const removeFromCart = (payload) => {
        dispatch(removeItem(payload))
        axios.post('http://localhost:5001/remove-cart-data', {...payload, quantity: isItemInCart.quantity - 1})
    }

    return (
        <div className="col-sm-6 col-lg-4 col-xl-3">
            <div className="card shadow h-100 p-3">
                {/* <!-- Image --> */}
                <img src={`http://localhost:8001/${image}`} className="card-img-top" alt="course image" style={{ height: '250px' }} />
                {/* <!-- Card body --> */}
                <div className="card-body pb-0">
                    {/* <!-- Title --> */}
                    <h5 className="card-title fw-normal"><a href="#">{title}</a></h5>
                    <p className="mb-2 text-truncate-2">{desc}</p>
                    <span className="h6 fw-light mb-0 text-primary"><i className="bi bi-tags-fill me-1"></i>{price} Rs</span>
                </div>
                {/* <!-- Card footer --> */}
                <div className="card-footer pt-0 pb-3">
                    <hr />
                    <div className="d-flex justify-content-center">
                        {!isItemInCart ?
                            <p className="h1 mb-0 btn btn-sm btn-danger text-white " onClick={() => { addToCart(props.data) }}><i className="bi bi-cart-plus-fill me-1 text-white"></i>Add to Cart</p>
                            :
                            <div className="d-flex justify-content-center align-items-center" style={{ gap: "5px" }}>
                                <span className="h1 mb-0 btn btn-sm btn-danger" onClick={() => { removeFromCart(props.data) }}>-</span>
                                <span className="h6 mb-0" style={{ padding: "5px" }}>{isItemInCart.quantity}</span>
                                <span className="h1 mb-0 btn btn-sm btn-primary" onClick={() => { addToCart(props.data) }}>+</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card;