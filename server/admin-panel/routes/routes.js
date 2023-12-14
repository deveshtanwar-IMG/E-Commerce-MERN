const express = require('express');
const router = express.Router();
const Admin = require('../models/admin')
const Products = require('../models/products')
const Category = require('../models/category')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth, rootAuth } = require('../middleware/Auth')
const upload = require('../middleware/multer')
const multer = require('multer')
const fs = require('fs');
const SubCategory = require('../models/sub-category');
// const flash = require('connect-flash')

const secret = process.env.TOKEN_SECRET;

// ******************************** Authentication *****************************************

router.get('/register', (req, res) => {
    res.render('register');
})

// register
router.post('/register', async (req, res) => {
    try {
        const hash_password = await bcrypt.hash(req.body.password, 13)
        req.body.password = hash_password
        const save = await Admin.create(req.body);
        if (!save) {
            res.render('/', { message: "something went Wrong! Please Retry" })
        }
        res.redirect('/')
    }
    catch (error) {
        console.log(error);
        throw error;
    }
})

//access login page
router.get('/', rootAuth, (req, res) => {
    res.render('login', { message: '' });
})

//login
router.post('/', async (req, res) => {
    try {
        const { emailPhone } = req.body;
        const query = {
            $or: [
                { email: emailPhone },
                { phone: emailPhone }
            ]
        }
        const userExist = await Admin.findOne(query)
        if (!userExist) {
            res.render('login', { message: "user does not exist" })
        }
        else {
            const isMatch = await bcrypt.compare(req.body.password, userExist.password)
            if (!isMatch) {
                res.render('login', { message: "credential do not match" });
            }
            else {
                if (userExist.token == '') {
                    const token = jwt.sign({ id: userExist.id }, secret)
                    res.cookie('userToken', token, { httpOnly: true, secure: true });
                    await Admin.updateOne({ _id: userExist.id }, { $set: { token: token } })
                    res.redirect(`/home/${userExist.id}`)
                }
                res.render('login', { message: "Already login in another device!! please logout first" })
            }
        }
    }
    catch (error) {
        console.log(error)
        throw error;
    }
})

router.get('/logout', async (req, res) => {
    try {
        const token = req.cookies.userToken;
        await Admin.updateOne({ token: token }, { $set: { token: "" } })
        res.clearCookie('userToken');
        res.redirect('/')
    } catch (error) {
        throw error
    }
})

// ************************************category ***********************************

router.get('/home/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userData = await Admin.findById({ _id: id });
        const productData = await Category.find()
        const productWithNestedData = [];

        // Check nested data for each product
        for (const product of productData) {
            const isNestedData = await SubCategory.find({ category_id: product.id });
            if (isNestedData.length > 0) {
                productWithNestedData.push(product.id);
            }
        }
        res.render('home', { data: userData, product: productData, productWithNestedData, message: req.flash('message') });
    } catch (error) {
        throw error
    }
})

router.get('/add', auth, (req, res) => {
    try {
        res.render('add', { submit: '/add', title: "Add Category", data: '' })
    } catch (error) {
        throw error
    }
})

router.post('/add', async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.render('add', { duplicate: 'File size exceded, max 1mb allowed', title: "Add Category", data: '' })
            } else if (err) {
                // An unknown error occurred when uploading.
                res.render('add', { duplicate: 'File format should jpeg/jpg/png only', title: "Add Category", data: '' })
            }
            else {
                if (!req.file) {
                    await Category.create(req.body)
                    res.redirect('/')
                }
                else {
                    const product = {
                        ...req.body,
                        image: req.file.filename
                    }
                    await Category.create(product);
                    res.redirect('/')
                }
            }
        })
    } catch (error) {
        throw error
    }
})

router.get('/edit/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const productData = await Category.findById({ _id: id })
        res.render('edit', { data: productData, submit: `/edit/${id}`, title: "Edit Category" })
    } catch (error) {
        throw error
    }
})

router.post('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const getDataById = await Category.findById({ _id: id })
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.render('edit', { duplicate: 'File size exceded, max 1mb allowed', data: getDataById, title: "Edit Category" })
            } else if (err) {
                // An unknown error occurred when uploading.
                res.render('edit', { duplicate: 'File format should be jpeg/jpg/png only', data: getDataById, title: "Edit Category" })
            }
            else {
                const { image } = getDataById
                // Everything went fine.
                if (!req.file) {
                    const productData = {
                        ...req.body,
                        image: image
                    }
                    await Category.findByIdAndUpdate({ _id: id }, productData)
                    res.redirect('/')
                }
                else {
                    if (image !== '628px-Ethereum_logo_2014 2.png') {
                        fs.unlink('./public/uploads/' + `${image}`, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log("Delete File successfully.");
                        });
                    }
                    const editedProduct = {
                        ...req.body,
                        image: req.file.filename
                    }
                    await Category.findByIdAndUpdate({ _id: id }, editedProduct)
                    res.redirect('/')
                }
            }
        })
    } catch (error) {
        throw error
    }
})

router.get('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const isNestedData = await SubCategory.find({ category_id: id });
        if (isNestedData.length > 0) {
            // res.redirect('/', { message: 'Delete child categories first' });
            req.flash('message', 'Delete child categories first');
            res.redirect('/');
            console.log("delete child category first")

        }
        else {
            const deleteData = await Category.findByIdAndDelete({ _id: id })
            if (deleteData.image !== '628px-Ethereum_logo_2014 2.png') {
                fs.unlink('./public/uploads/' + `${deleteData.image}`, (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log("Delete File successfully.");
                });
            }
            return res.redirect('/')
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
})

// ************************** sub category ************************************

router.get('/add-category/:id', auth, (req, res) => {
    const { id } = req.params;
    res.render('add', { submit: `/add-category/${id}`, title: "Add Sub Category", data: '' })
})


router.post('/add-category/:id', (req, res) => {
    const { id } = req.params;
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.render('add', { duplicate: 'File size exceded, max 1mb allowed', title: "Add Sub Category" })
        } else if (err) {
            // An unknown error occurred when uploading.
            res.render('add', { duplicate: 'File format should jpeg/jpg/png only', title: "Add Sub Category" })
        }
        else {
            if (!req.file) {
                const data = {
                    category_id: id,
                    ...req.body,
                }
                await SubCategory.create(data)
                res.redirect('/')
            }
            else {
                const data = {
                    category_id: id,
                    ...req.body,
                    image: req.file.filename
                }
                await SubCategory.create(data);
                res.redirect('/')
            }
        }
    })
})


router.get('/view/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const parentData = await Category.findById({ _id: id })
        const subCategoryData = await SubCategory.find({ category_id: id });
        res.render('view', { parentTitle: parentData.title, parent_id: id, product: subCategoryData, data: '' })
    } catch (error) {
        throw error
    }
})

router.get('/delete-category/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteData = await SubCategory.findByIdAndDelete({ _id: id })
        if (deleteData.image !== '628px-Ethereum_logo_2014 2.png') {
            fs.unlink('./public/uploads/' + `${deleteData.image}`, (err) => {
                if (err) {
                    throw err;
                }
                console.log("Delete File successfully.");
            });
        }
        return res.redirect('/')
    } catch (error) {
        console.log(error);
        throw error;
    }
})

router.get('/edit-category/:id', async (req, res) => {
    const { id } = req.params;
    const editData = await SubCategory.findById({ _id: id })
    res.render('edit', { data: editData, submit: `/edit-category/${id}`, title: "Edit Sub Category" })
})

router.post('/edit-category/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const getDataById = await SubCategory.findById({ _id: id })
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.render('edit', { duplicate: 'File size exceded, max 1mb allowed', data: getDataById, title: "Edit Sub Category" })
            } else if (err) {
                // An unknown error occurred when uploading.
                res.render('edit', { duplicate: 'File format should be jpeg/jpg/png only', data: getDataById, title: "Edit Sub Category" })
            }
            else {
                const { image } = getDataById
                // Everything went fine.
                if (!req.file) {
                    const productData = {
                        ...req.body,
                        image: image
                    }
                    await SubCategory.findByIdAndUpdate({ _id: id }, productData)
                    res.redirect('/')
                }
                else {
                    if (image !== '628px-Ethereum_logo_2014 2.png') {
                        fs.unlink('./public/uploads/' + `${image}`, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log("Delete File successfully.");
                        });
                    }
                    const editedProduct = {
                        ...req.body,
                        image: req.file.filename
                    }
                    await SubCategory.findByIdAndUpdate({ _id: id }, editedProduct)
                    res.redirect('/')
                }
            }
        })
    } catch (error) {
        throw error
    }
})

// **************************** product   **********************************

// add product pages 

router.get('/add-product', auth, (req, res) => {
    res.render('add-product', {data: ""})
})

router.get('/get-category', async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/get-sub-category', async (req, res) => {
    try {
        const subCategory = await SubCategory.find({ category_id: req.body.id });
        res.json(subCategory);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/add-product/:id', async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                // res.render('add-product', { duplicate: 'File size exceded, max 1mb allowed'})
            } else if (err) {
                // An unknown error occurred when uploading.
                // res.render('add-product', { duplicate: 'File format should be jpeg/jpg/png only'})
            }
            else {
                const user = {
                    ...req.body,
                    image: req.file.filename
                }
                await Products.create(user)
                res.redirect('/')
            }
        })
    } catch (error) {
        throw error
    }
})

// view product pages

router.get('/view-product', auth, (req, res) => {
    res.render('view-product', { product: '', data: '' });
})

router.post('/get-product', async (req, res) => {
    try {
        const products = await Products.find({ sub_category_id: req.body.id });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/edit-product/:id', auth, async (req, res) => {
    const { id } = req.params
    const productData = await Products.findById({ _id: id })
    const categoryData = await Category.findById({ _id: productData.category_id })
    const subCategoryData = await SubCategory.findById({ _id: productData.sub_category_id })
    res.render('edit-product', { data: productData, category: categoryData.title, subCategory: subCategoryData.title });
})

router.post('/edit-product/:id', async (req, res) => {
    try {
        const { id } = req.params
        const productData = await Products.findById({_id: id})
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                // res.render('edit-product', { duplicate: 'File size exceded, max 1mb allowed'})
            } else if (err) {
                // An unknown error occurred when uploading.
                // res.render('edit-product', { duplicate: 'File format should be jpeg/jpg/png only'})
            }
            else {
                const { image } = productData
                // Everything went fine.
                if (!req.file) {
                    const productData = {
                        ...req.body,
                        image: image
                    }
                    await Products.findByIdAndUpdate({ _id: id }, productData)
                    res.redirect('/')
                }
                else {
                    if (image !== '628px-Ethereum_logo_2014 2.png') {
                        fs.unlink('./public/uploads/' + `${image}`, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log("Delete File successfully.");
                        });
                    }
                    const editedProduct = {
                        ...req.body,
                        image: req.file.filename
                    }
                    await Products.findByIdAndUpdate({ _id: id }, editedProduct)
                    res.redirect('/')
                }
            }
        })
    } catch (error) {
        throw error
    }
})

router.get('/delete-product/:id', auth, async (req, res) => {
    const {id} = req.params;
    await Products.findByIdAndDelete({_id: id})
    res.redirect('/')
})

module.exports = router;