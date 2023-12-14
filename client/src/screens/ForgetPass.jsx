import { useState } from 'react'
import Avatar_01 from '/src/assets/images/avatar/01.jpg'
import Avatar_02 from '/src/assets/images/avatar/02.jpg'
import Avatar_03 from '/src/assets/images/avatar/03.jpg'
import Avatar_04 from '/src/assets/images/avatar/04.jpg'
import Image_02 from '/src/assets/images/element/02.svg'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OTPInputGroup from '../utils/otpInput'

const ForgetPass = () => {

	const [email, setEmail] = useState('');
	const [showOTP, setShowOTP] = useState(false)

	const forgetPassword = () => {
		axios.post('http://localhost:5001/forget-password', { email })
			.then((res) => {
				if (res?.data?.success) {
					window.scrollTo(0, 0)
					toast.success(res.data.message, {
						position: toast.POSITION.TOP_RIGHT,
					});
					setShowOTP(true)
					// setting localStorage
					localStorage.setItem('forget-pass-email', email)
				}
				else {
					window.scrollTo(0, 0)
					toast.error(res.data.message, {
						position: toast.POSITION.TOP_RIGHT,
					});
					setShowOTP(false)
				}
			})
	}

	const submitHandler = (e) => {
		e.preventDefault();
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
						<div className="col-12 col-lg-6 d-flex justify-content-center">
							<div className="row my-5">
								<div className="col-sm-10 col-xl-12 m-auto">

									{/* <!-- Title --> */}
									<span className="mb-0 fs-1">🤔</span>
									<h1 className="fs-2">Forgot Password?</h1>
									<h5 className="fw-light mb-4">To receive a new password, enter your email address below.</h5>

									{/* <!-- Form START --> */}
									<form onSubmit={(e) => { submitHandler(e) }}>
										{/* <!-- Email --> */}
										<div className="mb-4">
											<label htmlFor="exampleInputEmail1" className="form-label">Email address *</label>
											<div className="input-group input-group-lg">
												<span className="input-group-text bg-light rounded-start border-0 text-secondary px-3"><i className="bi bi-envelope-fill"></i></span>
												<input type="email" className="form-control border-0 bg-light rounded-end ps-1" placeholder="E-mail" id="exampleInputEmail1" onChange={(e) => { setEmail(e.target.value) }} />
											</div>
										</div>
										{/* <!-- Button --> */}
										<div className="align-items-center">
											<div className="d-grid">
												<button className="btn btn-primary mb-0" type="submit" onClick={forgetPassword}>Generate OTP</button>
												<ToastContainer />
											</div>
										</div>
									</form>
									{/* <!-- Form END --> */}
									{showOTP ? <OTPInputGroup email={email} /> : ''}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}

export default ForgetPass;