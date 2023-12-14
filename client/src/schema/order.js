import * as Yup from 'yup';

export const formValidation = Yup.object({
    name: Yup.string().min(2).max(25).required("please enter Your Name"),
    email: Yup.string().email().required('please enter your email'),
    phone: Yup.number().required('please enter your phone number'),
    postal_code: Yup.number().required('please enter your postal code'),
    address: Yup.string().required('please enter your address')
})