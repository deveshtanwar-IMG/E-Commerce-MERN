import * as Yup from 'yup';

export const formValidation = Yup.object({
    password: Yup.string().min(8).required('please enter your password'),
    confirm_pass: Yup.string(8).required().oneOf([Yup.ref('password'), null], 'password must match')
})