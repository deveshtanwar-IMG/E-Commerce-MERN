import Image_02 from '/src/assets/images/element/02.svg'
import Avatar_01 from '/src/assets/images/avatar/01.jpg'
import Avatar_02 from '/src/assets/images/avatar/02.jpg'
import Avatar_03 from '/src/assets/images/avatar/03.jpg'
import Avatar_04 from '/src/assets/images/avatar/04.jpg'
import Image_03 from '/src/assets/images/element/03.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { formValidation } from '../schema/registerSchema'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sign_up = () => {

    const navigate = useNavigate();

    const initialValues = {
        name: "",
        email: "",
        password: "",
        confirm_pass: ""
    }
    const [formData, setFormData] = useState(null)
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        if(formData){
            axios.post('http://localhost:5001/signup', {
                ...formData
            })
            .then((res) => { 
                if(res?.data?.success){
                    window. scrollTo(0, 0)
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setTimeout(()=>{
                        navigate('/')
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

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: formValidation,
        onSubmit: (values, action) => {
            setFormData(values)
            action.resetForm();
        }
    })

    const checkBoxHandler = () => {
        disabled ? setDisabled(false) : setDisabled(true)
    }

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
                                    <ul className="avatar-group mb-2 mb-sm-0">
                                        <li className="avatar avatar-sm"><img className="avatar-img rounded-circle" src={Avatar_01} alt="avatar" /></li>
                                        <li className="avatar avatar-sm"><img className="avatar-img rounded-circle" src={Avatar_02} alt="avatar" /></li>
                                        <li className="avatar avatar-sm"><img className="avatar-img rounded-circle" src={Avatar_03} alt="avatar" /></li>
                                        <li className="avatar avatar-sm"><img className="avatar-img rounded-circle" src={Avatar_04} alt="avatar" /></li>
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
                                    <img src={Image_03} className="h-40px mb-2" alt="" />

                                    <h2>Sign up for your account!</h2>
                                    <p className="lead mb-4">Nice to see you! Please Sign up with your account.</p>

                                    {/* <!-- Form START --> */}
                                    <form onSubmit={handleSubmit}>
                                        {/* <!-- Name --> */}
                                        <div className="mb-4">
                                            <label htmlFor="name" className="form-label">Name *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3"><i className="bi bi-person"></i></span>
                                                <input type="text" className="form-control border-0 bg-light rounded-end ps-1" placeholder="user name" id="name" autoComplete='off' name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur} />
                                            </div>
                                            {errors.name && touched.name ? <p style={{ color: 'red' }}>{errors.name}</p> : null}
                                        </div>
                                        {/* <!-- Email --> */}
                                        <div className="mb-4">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Email address *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3"><i className="bi bi-envelope-fill"></i></span>
                                                <input type="email" className="form-control border-0 bg-light rounded-end ps-1" placeholder="E-mail" id="exampleInputEmail1" name='email'
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur} />
                                            </div>
                                            {errors.email && touched.email ? <p style={{ color: 'red' }}>{errors.email}</p> : null}
                                        </div>
                                        {/* <!-- Password --> */}
                                        <div className="mb-4">
                                            <label htmlFor="inputPassword5" className="form-label">Password *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3"><i className="fas fa-lock"></i></span>
                                                <input type="password" className="form-control border-0 bg-light rounded-end ps-1" placeholder="*********" id="inputPassword5" name='password'
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur} />
                                            </div>
                                            {errors.password && touched.password ? <p style={{ color: 'red' }}>{errors.password}</p> : null}
                                        </div>
                                        {/* <!-- Confirm Password --> */}
                                        <div className="mb-4">
                                            <label htmlFor="inputPassword6" className="form-label">Confirm Password *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3"><i className="fas fa-lock"></i></span>
                                                <input type="password" className="form-control border-0 bg-light rounded-end ps-1" placeholder="*********" id="inputPassword6" name='confirm_pass'
                                                    value={values.confirm_pass}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur} />
                                            </div>
                                            {errors.confirm_pass && touched.confirm_pass ? <p style={{ color: 'red' }}>{errors.confirm_pass}</p> : null}
                                        </div>
                                        {/* <!-- Check box --> */}
                                        <div className="mb-4">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="checkbox-1" onClick={checkBoxHandler} />
                                                <label className="form-check-label" htmlFor="checkbox-1">By signing up, you agree to the<a href="#"> terms of service</a></label>
                                            </div>
                                        </div>
                                        {/* <!-- Button --> */}
                                        <div className="align-items-center mt-0">
                                            <div className="d-grid">
                                                <button className="btn btn-primary mb-0" type='submit' disabled={disabled}>Sign Up</button>
                                            </div>
                                        </div>
                                    </form>
                                    {/* <!-- Form END --> */}

                                    {/* <!-- Social buttons --> */}
                                    <div className="row">
                                        {/* <!-- Divider with text --> */}
                                        <div className="position-relative my-4">
                                            <hr />
                                            <p className="small position-absolute top-50 start-50 translate-middle bg-body px-5">Or</p>
                                        </div>
                                        {/* <!-- Social btn --> */}
                                        <div className="col-xxl-6 d-grid">
                                            <a href="#" className="btn bg-google mb-2 mb-xxl-0"><i className="fab fa-fw fa-google text-white me-2"></i>Signup with Google</a>
                                        </div>
                                        {/* <!-- Social btn --> */}
                                        <div className="col-xxl-6 d-grid">
                                            <a href="#" className="btn bg-facebook mb-0"><i className="fab fa-fw fa-facebook-f me-2"></i>Signup with Facebook</a>
                                        </div>
                                    </div>

                                    {/* <!-- Sign up link --> */}
                                    <div className="mt-4 text-center">
                                        <span>Already have an account?<Link to="/"> Sign in here</Link></span>
                                    </div>
                                    <ToastContainer />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Sign_up