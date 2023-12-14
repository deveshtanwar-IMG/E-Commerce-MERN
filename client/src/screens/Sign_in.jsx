import { Link, useNavigate } from 'react-router-dom'
import Avatar_01 from '/src/assets/images/avatar/01.jpg'
import Avatar_02 from '/src/assets/images/avatar/02.jpg'
import Avatar_03 from '/src/assets/images/avatar/03.jpg'
import Avatar_04 from '/src/assets/images/avatar/04.jpg'
import Image_02 from '/src/assets/images/element/02.svg'
import { useFormik } from 'formik'
import { formValidation } from '../schema/loginSchema'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/slices/userSlice'


const Sign_in = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const initialValues = {
        email: "",
        password: "",
    }
    const [formData, setFormData] = useState(null)

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: formValidation,
        onSubmit: (values, action) => {
            setFormData(values)
            action.resetForm();
        }
    })

    useEffect(() => {
        if(formData){
            axios.post('http://localhost:5001/signin', {
                ...formData
            })
            .then((res) => {
                if(res?.data?.success){
                    window.scrollTo(0, 0)
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    console.log(res.data)
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('isAuthenticated', true)

                    dispatch(setUserData(res.data.userDetails))
                    localStorage.setItem('userId', res.data.userDetails._id)
                    localStorage.setItem('name', res.data.userDetails.name)
                    localStorage.setItem('email', res.data.userDetails.email)
                    localStorage.setItem('image', res.data.userDetails.image)
                    setTimeout(()=>{
                        navigate('/home')
                    },1000)
                }
                else{
                    window. scrollTo(0, 0)
                    toast.error(res.data.error, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
            .catch((err) => { console.log(err) })
        }
    }, [formData])

    return (
        <main>
            <section className="p-0 d-flex align-items-center position-relative overflow-hidden">

                <div className="container-fluid">
                    <div className="row">
                        {/* <!-- left --> */}
                        <div className="col-12 col-lg-6 d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
                            <div className="p-3 p-lg-5">
                                {/* <!-- Title --> */}
                                <div className="text-center">
                                    <h2 className="fw-bold">Welcome to our largest community</h2>
                                    <p className="mb-0 h6 fw-light">Let's learn something new today!</p>
                                </div>
                                {/* <!-- SVG Image --> */}
                                <img src={Image_02} className="mt-5" alt="" /> 
                                    {/* <!-- Info --> */}
                                    <div className="d-sm-flex mt-5 align-items-center justify-content-center">
                                        {/* <!-- Avatar group --> */}
                                        <ul className="avatar-group mb-2 mb-sm-0">
                                            <li className="avatar avatar-sm">
                                                <img className="avatar-img rounded-circle" src={Avatar_01} alt="avatar" />
                                            </li>
                                            <li className="avatar avatar-sm">
                                                <img className="avatar-img rounded-circle" src={Avatar_02}  alt="avatar" />
                                            </li>
                                            <li className="avatar avatar-sm">
                                                <img className="avatar-img rounded-circle" src={Avatar_03}  alt="avatar" />
                                            </li>
                                            <li className="avatar avatar-sm">
                                                <img className="avatar-img rounded-circle" src={Avatar_04}  alt="avatar" />
                                            </li>
                                        </ul>
                                        {/* <!-- Content --> */}
                                        <p className="mb-0 h6 fw-light ms-0 ms-sm-3">4k+ Students joined us, now it's your turn.</p>
                                    </div>
                            </div>
                        </div>

                        {/* <!-- Right --> */}
                        <div className="col-12 col-lg-6 m-auto">
                            <div className="row my-5">
                                <div className="col-sm-10 col-xl-8 m-auto">
                                    {/* <!-- Title --> */}
                                    <span className="mb-0 fs-1">👋</span>
                                    <h1 className="fs-2">Login into Eduport!</h1>
                                    <p className="lead mb-4">Nice to see you! Please log in with your account.</p>

                                    {/* <!-- Form START --> */}
                                    <form onSubmit={handleSubmit}>
                                        {/* <!-- Email --> */}
                                        <div className="mb-4">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Email address *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3"><i className="bi bi-envelope-fill"></i></span>
                                                <input type="email" className="form-control border-0 bg-light rounded-end ps-1" placeholder="E-mail" id="exampleInputEmail1" name='email'
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}/>
                                            </div>
                                        </div>
                                        {errors.email && touched.email ? <p style={{ color: 'red' }}>{errors.email}</p> : null}
                                        {/* <!-- Password --> */}
                                        <div className="mb-4">
                                            <label htmlFor="inputPassword5" className="form-label">Password *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3"><i className="fas fa-lock"></i></span>
                                                <input type="password" className="form-control border-0 bg-light rounded-end ps-1" placeholder="password" id="inputPassword5"
                                                name='password'
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}/>
                                            </div>
                                            {errors.password && touched.password ? <p style={{ color: 'red' }}>{errors.password}</p> : null}
                                        </div>
                                        {/* <!-- Check box --> */}
                                        <div className="mb-4 d-flex justify-content-between mb-4">
                                            {/* <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                                    <label className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
                                            </div> */}
                                            <div className="text-primary-hover">
                                                <Link to="/forget-password" className="text-primary">
                                                    <u>Forgot password?</u>
                                                </Link>
                                            </div>
                                        </div>
                                        {/* <!-- Button --> */}
                                        <div className="align-items-center mt-0">
                                            <div className="d-grid">
                                                <button className="btn btn-primary mb-0" type="submit">Login</button>
                                            </div>
                                        </div>
                                    </form>
                                    {/* <!-- Form END --> */}

                                    {/* <!-- Social buttons and divider --> */}
                                    <div className="row">
                                        {/* <!-- Divider with text --> */}
                                        <div className="position-relative my-4">
                                            <hr />
                                                <p className="small position-absolute top-50 start-50 translate-middle bg-body px-5">Or</p>
                                        </div>

                                        {/* <!-- Social btn --> */}
                                        <div className="col-xxl-6 d-grid">
                                            <a href="#" className="btn bg-google mb-2 mb-xxl-0"><i className="fab fa-fw fa-google text-white me-2"></i>Login with Google</a>
                                        </div>
                                        {/* <!-- Social btn --> */}
                                        <div className="col-xxl-6 d-grid">
                                            <a href="#" className="btn bg-facebook mb-0"><i className="fab fa-fw fa-facebook-f me-2"></i>Login with Facebook</a>
                                        </div>
                                    </div>

                                    {/* <!-- Sign up link --> */}
                                    <div className="mt-4 text-center">
                                        <span>Don't have an account? <Link to="/signup">Signup here</Link></span>
                                        <ToastContainer />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Sign_in;