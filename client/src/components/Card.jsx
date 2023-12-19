import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "../redux/slices/cartSlice";
import { postAPIAuth } from "../services/api";

const Card = (props) => {
    const { title, price, image, desc, _id } = props.data;
    const dispatch = useDispatch()
    const data = useSelector(state => state.cart)

    const isItemInCart = data.items.find(item => item.product_id == _id)

    const addToCart = (payload) => {
        const cartData = {
            ...payload,
            quantity: 1,
            product_id : payload._id
        }
        delete cartData._id;
        dispatch(addItem(cartData))

        // api call
        postAPIAuth('set-cart-data', {
            ...cartData,
            quantity: isItemInCart ? isItemInCart.quantity + 1 : 1
        })
    }

    const removeFromCart = (payload) => {
        const cartData = {
            ...payload,
            product_id : payload._id
        }
        delete cartData._id;
        dispatch(removeItem(cartData))
        // api call
        postAPIAuth('remove-cart-data', { ...cartData, quantity: isItemInCart.quantity - 1 })
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