import React from 'react'
import logoLight from '../assets/images/logo-light.svg'

const MiniFooter = () => {
    return (
        <>
            <footer className="bg-dark p-3">
                <div className="container">
                    <div className="row align-items-center">
                        {/* <!-- Widget --> */}
                        <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
                            {/* <!-- Logo START --> */}
                            <a href="index-2.html"> <img className="h-20px" src={logoLight} alt="logo" /> </a>
                        </div>

                        {/* <!-- Widget --> */}
                        <div className="col-md-4 mb-3 mb-md-0">
                            <div className="text-center text-white">
                                Copyrights ©2021 <a href="#" className="text-reset btn-link">Eduport</a>. All rights reserved.
                            </div>
                        </div>
                        {/* <!-- Widget --> */}
                        <div className="col-md-4">
                            {/* <!-- Rating --> */}
                            <ul className="list-inline mb-0 text-center text-md-end">
                                <li className="list-inline-item ms-2"><a href="#"><i className="text-white fab fa-facebook"></i></a></li>
                                <li className="list-inline-item ms-2"><a href="#"><i className="text-white fab fa-instagram"></i></a></li>
                                <li className="list-inline-item ms-2"><a href="#"><i className="text-white fab fa-linkedin-in"></i></a></li>
                                <li className="list-inline-item ms-2"><a href="#"><i className="text-white fab fa-twitter"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default MiniFooter