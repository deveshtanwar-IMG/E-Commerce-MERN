import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
// import axios from "axios";
import { getAPI } from "../services/api";

const Orders = () => {

    const userId = localStorage.getItem('userId')
    const [orders, setOrders] = useState()

    useEffect(() => {
        // axios.post('http://localhost:5001/get-orders', { userId })
        getAPI('get-orders')
        .then((res) => {
            setOrders(res.data.orders)
        })
    },[])
    return (
        <>

            {/* Header */}
            <Header />

            <section className="pt-0">
                <div className="container">
                    <div className="row">

                        {/* <!-- Main content START --> */}


                        {/* <!-- Card START --> */}
                        <div className="card border bg-transparent rounded-3">
                            {/* <!-- Card header START --> */}
                            <div className="card-header bg-transparent border-bottom">
                                <h3 className="mb-0">Order List</h3>
                            </div>
                            {/* <!-- Card header END --> */}

                            {/* <!-- Card body START --> */}
                            <div className="card-body">

                                {/* <!-- Order list table START --> */}
                                <div className="table-responsive border-0">
                                    {/* <!-- Table START --> */}
                                    <table className="table align-middle p-4 mb-0 table-hover">
                                        {/* <!-- Table head --> */}
                                        <thead>
                                            <tr>
                                                <th scope="col" className="border-0">#</th>
                                                <th scope="col" className="border-0">Order ID</th>
                                                <th scope="col" className="border-0">Date</th>
                                                <th scope="col" className="border-0">Amount</th>
                                            </tr>
                                        </thead>

                                        {/* <!-- Table body START --> */}
                                        <tbody>
                                            {/* <!-- Table item --> */}
                                            {orders && orders.map((val, index) => {
                                                return (
                                                    <tr key={val._id}>
                                                        {/* <!-- Table data --> */}
                                                        <td>
                                                            <h6><a href="#">{index}</a></h6>
                                                        </td>

                                                        {/* <!-- Table data --> */}
                                                        <td className="text-center text-sm-start text-primary-hover">
                                                            <p>{val.order_id}</p>
                                                        </td>

                                                        {/* <!-- Table data --> */}
                                                        <td>{val.created}</td>

                                                        {/* <!-- Table data --> */}
                                                        <td>Rs {val.amount}</td>

                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                        {/* <!-- Table body END --> */}
                                    </table>
                                    {/* <!-- Table END --> */}
                                </div>
                                {/* <!-- Order list table END --> */}
                            </div>
                            {/* <!-- Card body START --> */}
                        </div>
                        {/* <!--Card END  --> */}
                        {/* <!-- Main content END --> */}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </>
    )
}

export default Orders;