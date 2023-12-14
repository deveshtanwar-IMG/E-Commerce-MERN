import React, { useEffect, useState } from 'react'
import MiniFooter from '../components/MiniFooter'
import Header from '../components/Header'
import { useFormik } from 'formik'
import { formValidation } from '../schema/editProfile'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUser = () => {
    const email = localStorage.getItem('email')
    const [state, setState] = useState('')
    const [image, setImage] = useState(null)
    const [fetchedData, setFetchedData] = useState({})
    let formData = new FormData();

    useEffect(() => {
        axios.post('http://localhost:5001/get-user-details', { email })
            .then((res) => {
                setFetchedData(res.data.userDetails)

                localStorage.setItem('name', res.data.userDetails.name)
                localStorage.setItem('email', res.data.userDetails.email)
                localStorage.setItem('image', res.data.userDetails.image)
            })
    }, [formData])

    let initialValues = {
        name: fetchedData.name || '',
        email: fetchedData.email || '',
        phone: fetchedData.phone || '',
        postal_code: fetchedData.postal_code || '',
        address: fetchedData.address || ''
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: formValidation,
        enableReinitialize: true,
        onSubmit: async (values, action) => {
            formData.append('name', values.name);
            formData.append('image', image)
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('postal_code', values.postal_code);
            formData.append('address', values.address);
            formData.append('state', state);
            action.resetForm()
            await axios.post('http://localhost:5001/edit-profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then((res) => {
                    if (res?.data?.success) {
                        window.scrollTo(0, 0)
                        toast.success(res.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        setImage('')
                        setState('')
                    }
                    else {
                        window.scrollTo(0, 0)
                        toast.error(res.data.message, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        setImage('')
                        setState('')
                    }
                })
        }
    })

    const previewHandler = (e) => {
        if (e.target && e.target.files[0]) {
            setImage(e.target.files[0])
        }
        var input = e.target;
        var preview = document.getElementById('preview');

        var reader = new FileReader();
        reader.onload = function () {
            preview.src = reader.result;
            preview.style.display = "inline-block";
        };
        reader.readAsDataURL(input.files[0]);// important line
    }

    return (
        <>
            <Header />
            <ToastContainer />
            {/* <!-- Edit profile START --> */}
            <div className="container card bg-transparent border rounded-3 my-1">
                {/* <!-- Card header --> */}
                <div className="card-header bg-transparent border-bottom">
                    <h3 className="card-header-title mb-0">Edit Profile</h3>
                </div>
                {/* <!-- Card body START --> */}
                <div className="card-body">
                    {/* <!-- Form --> */}
                    <form className="row g-4" onSubmit={handleSubmit}>

                        {/* <!-- Profile picture --> */}
                        <div className="col-12 justify-content-center align-items-center">
                            <label className="form-label">Profile picture</label>
                            <div className="d-flex align-items-center">
                                <label className="position-relative me-4" htmlFor="uploadfile-1" title="Replace this pic">
                                    {/* <!-- Avatar place holder --> */}
                                    <span className="avatar avatar-xl">
                                        <img id='preview' className="avatar-img rounded-circle border border-white border-3" src={`http://localhost:5001/${fetchedData.image}`} alt="" />
                                    </span>
                                </label>
                                {/* <!-- Upload button --> */}
                                <label className="btn btn-primary-soft mb-0" htmlFor="uploadfile-1">Change</label>
                                <input id="uploadfile-1" className="form-control d-none" type="file" name='image' onChange={(e) => { previewHandler(e) }} />
                            </div>
                        </div>

                        {/* <!-- Full name --> */}
                        <div className="col-6">
                            <label className="form-label" htmlFor='name'>Full name</label>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="name" id='name' name='name'
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur} />
                            </div>
                            {errors.name && touched.name ? <p style={{ color: 'red' }}>{errors.name}</p> : null}
                        </div>

                        {/* <!-- Email id --> */}
                        <div className="col-md-6">
                            <label className="form-label">Email id</label>
                            <input className="form-control" type="email" placeholder="Email" name='email'
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur} />
                            {errors.email && touched.email ? <p style={{ color: 'red' }}>{errors.email}</p> : null}
                        </div>

                        {/* <!-- Phone number --> */}
                        <div className="col-md-6">
                            <label className="form-label">Phone number</label>
                            <input type="text" className="form-control" placeholder="+91" name='phone'
                                maxLength={12}
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur} />
                            {errors.phone && touched.phone ? <p style={{ color: 'red' }}>{errors.phone}</p> : null}
                        </div>

                        {/* <!-- Country --> */}
                        <div className="col-md-6 bg-light-input">
                            <label htmlFor="mobileNumber" className="form-label">Country</label>
                            <select className="form-select js-choice" aria-label=".form-select-lg" disabled>
                                <option value="india">India</option>
                            </select>
                        </div>

                        {/* <!-- State option --> */}
                        <div className="col-md-6 bg-light-input">
                            <label htmlFor="mobileNumber" className="form-label">Select state *</label>
                            <select className="form-select js-choice" aria-label=".form-select-lg" required onChange={(e) => { setState(e.target.value) }}>
                                <option value="">Select state</option>
                                <option value="maharashtra">Maharashtra</option>
                                <option value="delhi">Delhi</option>
                                <option value="punjab">Punjab</option>
                                <option value="gujrat">Gujrat</option>
                                <option value="rajasthan">Rajasthan</option>
                                <option value="uttarpradesh">Uttar Pradesh</option>
                            </select>
                        </div>
                        {/* <!-- Postal code --> */}
                        <div className="col-md-6 bg-light-input">
                            <label htmlFor="postalCode" className="form-label">Postal code *</label>
                            <input type="text" className="form-control" id="postalCode" placeholder="PIN code" name='postal_code'
                                maxLength={10}
                                value={values.postal_code}
                                onChange={handleChange}
                                onBlur={handleBlur} />
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

                        {/* <!-- Save button --> */}
                        <div className="d-sm-flex justify-content-end">
                            <button type="submit" className="btn btn-primary mb-0">Save changes</button>
                        </div>
                    </form>
                </div>
                {/* <!-- Card body END --> */}
            </div>
            {/* <!-- Edit profile END --> */}

            <MiniFooter />
        </>
    )
}

export default EditUser;