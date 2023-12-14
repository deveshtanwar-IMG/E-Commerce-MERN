import { useNavigate} from 'react-router-dom'
import Avatar_01 from '/src/assets/images/avatar/01.jpg'
import Avatar_02 from '/src/assets/images/avatar/02.jpg'
import Avatar_03 from '/src/assets/images/avatar/03.jpg'
import Avatar_04 from '/src/assets/images/avatar/04.jpg'
import Image_02 from '/src/assets/images/element/02.svg'
import { useFormik } from 'formik'
import { formValidation } from '../schema/resetPassSchema'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPass = () => {

    const navigate = useNavigate()
    const initialValues = {
        password: "",
        confirm_pass: "",
    }
    const [formData, setFormData] = useState(null)

    const email = localStorage.getItem('forget-pass-email')

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
            axios.post('http://localhost:5001/reset-password', {
                ...formData,
                email: email
            })
            .then((res) => {
                if(res?.data?.success){
                    window.scrollTo(0, 0)
                    toast.success(res.data.message, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    setTimeout(()=>{
                        navigate('/')
                    },1000)
                    localStorage.setItem('forget-pass-email', '')
                }
                else{
                    window. scrollTo(0, 0)
                    toast.error(res.data.message, {
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
                <ToastContainer />
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
                                    <h1 className="fs-2">Reset Password</h1>
                                    <p className="lead mb-4">Nice to see you! Please enter your new password.</p>

                                    {/* <!-- Form START --> */}
                                    <form onSubmit={handleSubmit}>
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
                                        <div className="mb-4">
                                            <label htmlFor="confirm_pass" className="form-label">Confirm Password *</label>
                                            <div className="input-group input-group-lg">
                                                <span className="input-group-text bg-light rounded-start border-0 text-secondary px-3"><i className="fas fa-lock"></i></span>
                                                <input type="password" className="form-control border-0 bg-light rounded-end ps-1" placeholder="password" id="confirm_pass"
                                                name='confirm_pass'
                                                value={values.confirm_pass}
                                                onChange={handleChange}
                                                onBlur={handleBlur}/>
                                            </div>
                                            {errors.confirm_pass && touched.confirm_pass ? <p style={{ color: 'red' }}>{errors.confirm_pass}</p> : null}
                                        </div>
                                        {/* <!-- Button --> */}
                                        <div className="align-items-center mt-0">
                                            <div className="d-grid">
                                                <button className="btn btn-primary mb-0" type="submit">Submit</button>
                                            </div>
                                        </div>
                                    </form>
                                    {/* <!-- Form END --> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ResetPass;