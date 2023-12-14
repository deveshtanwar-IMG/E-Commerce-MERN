import logo from '../assets/images/logo.svg'
import darkLogo from '../assets/images/logo-light.svg'
import english from '../assets/images/flags/uk.svg'
import german from '../assets/images/flags/gr.svg'
import french from '../assets/images/flags/sp.svg'
import googlePlay from '../assets/images/client/google-play.svg'
import appStore from '../assets/images/client/app-store.svg'

const Footer = () => {
    return (
        <footer className="pt-5">
            <div className="container">
                {/* <!-- Row START --> */}
                <div className="row g-4">

                    {/* <!-- Widget 1 START --> */}
                    <div className="col-lg-3">
                        {/* <!-- logo --> */}
                        <a className="me-0" href="index-2.html">
                            <img className="light-mode-item h-40px" src={logo} alt="logo" />
                            <img className="dark-mode-item h-40px" src={darkLogo} alt="logo" />
                        </a>
                        <p className="my-3">Eduport education theme, built specifically for the education centers which is dedicated to teaching and involve learners.</p>
                        {/* <!-- Social media icon --> */}
                        <ul className="list-inline mb-0 mt-3">
                            <li className="list-inline-item"> <a className="btn btn-white btn-sm shadow px-2 text-facebook" href="#"><i className="fab fa-fw fa-facebook-f"></i></a> </li>
                            <li className="list-inline-item"> <a className="btn btn-white btn-sm shadow px-2 text-instagram" href="#"><i className="fab fa-fw fa-instagram"></i></a> </li>
                            <li className="list-inline-item"> <a className="btn btn-white btn-sm shadow px-2 text-twitter" href="#"><i className="fab fa-fw fa-twitter"></i></a> </li>
                            <li className="list-inline-item"> <a className="btn btn-white btn-sm shadow px-2 text-linkedin" href="#"><i className="fab fa-fw fa-linkedin-in"></i></a> </li>
                        </ul>
                    </div>
                    {/* <!-- Widget 1 END --> */}

                    {/* <!-- Widget 2 START --> */}
                    <div className="col-lg-6">
                        <div className="row g-4">
                            {/* <!-- Link block --> */}
                            <div className="col-6 col-md-4">
                                <h5 className="mb-2 mb-md-4">Company</h5>
                                <ul className="nav flex-column">
                                    <li className="nav-item"><a className="nav-link" href="#">About us</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Contact us</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">News and Blogs</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Library</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Career</a></li>
                                </ul>
                            </div>

                            {/* <!-- Link block --> */}
                            <div className="col-6 col-md-4">
                                <h5 className="mb-2 mb-md-4">Community</h5>
                                <ul className="nav flex-column">
                                    <li className="nav-item"><a className="nav-link" href="#">Documentation</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Faq</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Forum</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Sitemap</a></li>
                                </ul>
                            </div>

                            {/* <!-- Link block --> */}
                            <div className="col-6 col-md-4">
                                <h5 className="mb-2 mb-md-4">Teaching</h5>
                                <ul className="nav flex-column">
                                    <li className="nav-item"><a className="nav-link" href="#">Become a teacher</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">How to guide</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Terms &amp; Conditions</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Widget 2 END --> */}

                    {/* <!-- Widget 3 START --> */}
                    <div className="col-lg-3">
                        <h5 className="mb-2 mb-md-4">Contact</h5>
                        {/* <!-- Time --> */}
                        <p className="mb-2">
                            Toll free:<span className="h6 fw-light ms-2">+1234 568 963</span>
                            <span className="d-block small">(9:AM to 8:PM IST)</span>
                        </p>

                        <p className="mb-0">Email:<span className="h6 fw-light ms-2">example@gmail.com</span></p>

                        <div className="row g-2 mt-2">
                            {/* <!-- Google play store button --> */}
                            <div className="col-6 col-sm-4 col-md-3 col-lg-6">
                                <a href="#"> <img src={googlePlay} alt="" /> </a>
                            </div>
                            {/* <!-- App store button --> */}
                            <div className="col-6 col-sm-4 col-md-3 col-lg-6">
                                <a href="#"> <img src={appStore} alt="app-store" /> </a>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Widget 3 END --> */}
                </div>

                {/* <!-- Divider --> */}
                <hr className="mt-4 mb-0" />

                {/* <!-- Bottom footer --> */}
                <div className="py-3">
                    <div className="container px-0">
                        <div className="d-md-flex justify-content-between align-items-center py-3 text-center text-md-left">
                            {/* <!-- copyright text --> */}
                            <div className="text-primary-hover"> Copyrights <a href="#" className="text-body">©2021 Eduport</a>. All rights reserved. </div>
                            {/* <!-- copyright links--> */}
                            <div className=" mt-3 mt-md-0">
                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                        {/* <!-- Language selector --> */}
                                        <div className="dropup mt-0 text-center text-sm-end">
                                            <a className="dropdown-toggle nav-link" href="#" role="button" id="languageSwitcher" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fas fa-globe me-2"></i>Language
                                            </a>
                                            <ul className="dropdown-menu min-w-auto" aria-labelledby="languageSwitcher">
                                                <li><a className="dropdown-item me-4" href="#"><img className="fa-fw me-2" src={english} alt="" />English</a></li>
                                                <li><a className="dropdown-item me-4" href="#"><img className="fa-fw me-2" src={german} alt="" />German </a></li>
                                                <li><a className="dropdown-item me-4" href="#"><img className="fa-fw me-2" src={french} alt="" />French</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="list-inline-item"><a className="nav-link" href="#">Terms of use</a></li>
                                    <li className="list-inline-item"><a className="nav-link pe-0" href="#">Privacy policy</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer