import * as Yup from 'yup';

export const formValidation = Yup.object({
    name: Yup.string().min(2).max(25).required("please enter Your Name"),
    email: Yup.string().email().required('please enter your email'),
    password: Yup.string().min(8).required('please enter your password'),
    confirm_pass: Yup.string(8).required().oneOf([Yup.ref('password'), null], 'password must match')
})