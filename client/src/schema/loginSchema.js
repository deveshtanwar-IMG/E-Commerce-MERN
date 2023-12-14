import * as Yup from 'yup';

export const formValidation = Yup.object({
    email: Yup.string().email().required('please enter your email'),
    password: Yup.string().min(8).required('please enter your password')
})