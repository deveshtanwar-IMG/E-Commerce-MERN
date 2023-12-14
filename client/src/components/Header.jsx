import logo from '../assets/images/logo.svg'
import darkLogo from '../assets/images/logo-light.svg'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { setCartData } from '../redux/slices/cartSlice'

const userId = localStorage.getItem('userId')

const Header = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const name = localStorage.getItem('name')
    const email = localStorage.getItem('email')
    const image = localStorage.getItem('image')

    const data = useSelector(state => state.cart)

    useEffect(() => {
        axios.post('http://localhost:5001/fetch-cart-data', { userId })
        .then((res)=>{
            if (res.data.success) {
                const cartData = res.data.cartData;
                dispatch(setCartData(cartData));
            }
        })
    }, [])

    const signoutHandler = async () => {
        try {
            const token = localStorage.getItem('token')
            const user_id = localStorage.getItem('userId')
            const headers = {
                user_id: user_id,
                authorisation: `Bearer ${token}`
            }
            await axios.post(`http://localhost:5001/logout`, {}, { headers })
            localStorage.setItem('isAuthenticated', false)
            localStorage.setItem('token', '')

            localStorage.setItem('userId', '')
            localStorage.setItem('name', '')
            localStorage.setItem('email', '')
            localStorage.setItem('image', '')
            navigate('/')
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    return (
        <div>
            {/* <!-- Header START --> */}
            <header className="navbar-light navbar-sticky header-static">
                {/* <!-- Logo Nav START --> */}
                <nav className="navbar navbar-expand-xl">
                    <div className="container-fluid px-3 px-xl-5">
                        {/* <!-- Logo START --> */}
                        <Link className="navbar-brand" to='/home'>
                            <img className="light-mode-item navbar-brand-item" src={logo} alt="logo" />
                            <img className="dark-mode-item navbar-brand-item" src={darkLogo} alt="logo" />
                        </Link>
                        {/* <!-- Logo END --> */}

                        {/* <!-- Responsive navbar toggler --> */}
                        <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-animation">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>

                        {/* <!-- Main navbar START --> */}
                        <div className="navbar-collapse w-100 collapse" id="navbarCollapse">

                            {/* <!-- Nav category menu START --> */}
                            <ul className="navbar-nav navbar-nav-scroll me-auto">
                                {/* <!-- Nav item 1 Demos --> */}
                                <li className="nav-item dropdown dropdown-menu-shadow-stacked">
                                    <a className="nav-link bg-primary bg-opacity-10 rounded-3 text-primary px-3 py-3 py-xl-0" href="#" id="categoryMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="bi bi-ui-radios-grid me-2"></i><span>Category</span></a>
                                </li>
                            </ul>
                            {/* <!-- Nav category menu END --> */}

                            {/* <!-- Nav Main menu START --> */}
                            <ul className="navbar-nav navbar-nav-scroll me-auto">
                                {/* <!-- Nav item 1 Demos --> */}
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle active" href="#" id="demoMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Demos</a>
                                </li>

                                {/* <!-- Nav item 2 Pages --> */}
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="pagesMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Pages</a>
                                </li>

                                {/* <!-- Nav item 3 Account --> */}
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="accounntMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Accounts</a>
                                </li>

                                {/* <!-- Nav item 4 Megamenu--> */}
                                <li className="nav-item dropdown dropdown-fullwidth">
                                    <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Megamenu</a>
                                </li>
                            </ul>
                            {/* <!-- Nav Main menu END --> */}

                        </div>
                        <div className="nav my-3 my-xl-0 px-4 flex-nowrap align-items-center">
                            <div className='cart' style={{ position: 'relative' }}>
                                <small className='badge' style={{ position: 'absolute', backgroundColor: 'red', color: 'white', top: '-10px', right: '-10px', zIndex: '9999', borderRadius: '15px', fontWeight: 'bold' }}>{data.totalCount != 0 ? data.totalCount : ''}</small>
                                <Link to='/cart'><button className='bi bi-cart-fill btn btn-sm btn-primary' style={{ fontSize: '16px' }}></button></Link>
                            </div>
                        </div>
                        {/* <!-- Main navbar END --> */}

                        {/* <!-- Profile START --> */}
                        <div className="dropdown ms-1 ms-lg-0">
                            <a className="avatar avatar-sm p-0" href="#" id="profileDropdown" role="button" data-bs-auto-close="outside" data-bs-display="static" data-bs-toggle="dropdown" aria-expanded="false">
                                <img className="avatar-img rounded-circle" src={`http://localhost:5001/${image}`} alt="avatar" />
                            </a>
                            <ul className="dropdown-menu dropdown-animation dropdown-menu-end shadow pt-3" aria-labelledby="profileDropdown">
                                {/* <!-- Profile info --> */}
                                <li className="px-3">
                                    <div className="d-flex align-items-center">
                                        {/* <!-- Avatar --> */}
                                        <div className="avatar me-3">
                                            <img className="avatar-img rounded-circle shadow" src={`http://localhost:5001/${image}`} alt="avatar" />
                                        </div>
                                        <div>
                                            <a className="h6" href="#">{name}</a>
                                            <p className="small m-0">{email}</p>
                                        </div>
                                    </div>
                                    <hr />
                                </li>
                                {/* <!-- Links --> */}
                                <li><Link className="dropdown-item" to="/edit-profile"><i className="bi bi-person fa-fw me-2"></i>Edit Profile</Link></li>
                                <li><Link className="dropdown-item" to='/orders'><i className="bi bi-info-circle fa-fw me-2"></i>Orders</Link></li>
                                <li onClick={signoutHandler}><a className="dropdown-item bg-danger-soft-hover" href='#'><i className="bi bi-power fa-fw me-2"></i>Sign Out</a></li>
                                <li> <hr className="dropdown-divider" /></li>
                                {/* <!-- Dark mode switch START --> */}
                                <li>
                                    <div className="modeswitch-wrap" id="darkModeSwitch">
                                        <div className="modeswitch-item">
                                            <div className="modeswitch-icon"></div>
                                        </div>
                                        <span>Dark mode</span>
                                    </div>
                                </li>
                                {/* <!-- Dark mode switch END --> */}
                            </ul>
                        </div>
                        {/* <!-- Profile START --> */}
                    </div>
                </nav>
                {/* <!-- Logo Nav END --> */}
            </header>
            {/* <!-- Header END --> */}
        </div>
    )
}

export default Header;