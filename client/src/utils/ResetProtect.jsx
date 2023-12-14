import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResetProtect = (props) => {

    const { Component } = props
    const navigate = useNavigate()

    useEffect(() => {
        let forgetEmail = localStorage.getItem('forget-pass-email')
        console.log('forgetEmail : ', forgetEmail)
        if(forgetEmail === ''){
            navigate('/')
        }
        else{
            navigate('/reset-password')
        }
    },[])

    return (
        <div>
            {Component}
        </div>
    )
}

export default ResetProtect