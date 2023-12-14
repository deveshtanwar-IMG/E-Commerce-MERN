import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Protected = (props) => {

    const { Component } = props
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        let login = JSON.parse(localStorage.getItem('isAuthenticated'))
        console.log('isAuthenticated : ',login)
        if(!login){
            navigate('/')
        }
        else{
            if(location.pathname === '/'){
                navigate('/home')
            }
        }
    },[])

    return (
        <div>
            {Component}
        </div>
    )
}

export default Protected