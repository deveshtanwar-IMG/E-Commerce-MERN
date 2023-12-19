const express = require('express');
const router = express.Router();
const Admin = require('../models/admin')
const Products = require('../models/products')
const Category = require('../models/category')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { auth, rootAuth } = require('../middleware/Auth')
const upload = require('../middleware/multer')
const fs = require('fs');

const secret = process.env.TOKEN_SECRET;

// ******************************** Authentication *****************************************

router.get('/register', (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
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
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

//access login page
router.get('/', rootAuth, (req, res) => {
    try {
        res.render('login', { message: '' });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
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
                const token = jwt.sign({ id: userExist.id }, secret)
                res.cookie('userToken', token, { httpOnly: true, secure: true });
                await Admin.updateOne({ _id: userExist.id }, { $set: { token: token } })
                res.redirect(`/home`)
            }
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.get('/logout', auth, async (req, res) => {
    try {
        const token = req.cookies.userToken;
        await Admin.updateOne({ token: token }, { $set: { token: "" } })
        res.clearCookie('userToken');
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

// ************************************category ***********************************

router.get('/home', auth, async (req, res) => {
    try {
        const id = req.userId
        const userData = await Admin.findById({ _id: id });
        const categoryData = await Category.find({ parent_id: null })
        const productWithNestedData = [];

        // Check nested data for each product
        for (const x of categoryData) {
            const isNestedData = await Category.find({ parent_id: x._id });
            if (isNestedData.length > 0) {
                productWithNestedData.push(x.id)
            }
        }
        res.render('home', { data: userData, product: categoryData, productWithNestedData, message: '' });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.get('/add', auth, (req, res) => {
    try {
        res.render('add', { submit: '/add', title: "Add Category", data: '' });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.post('/add', upload, auth, async (req, res) => {
    try {
        if (!req.file) {
            await Category.create(req.body)
            res.redirect('/')
        }
        else {
            const category = {
                ...req.body,
                image: req.file.filename
            }
            await Category.create(category);
            res.redirect('/')
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.get('/edit/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const productData = await Category.findById({ _id: id })
        res.render('edit', { data: productData, submit: `/edit/${id}`, title: "Edit Category" })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.post('/edit/:id', upload, auth, async (req, res) => {
    try {
        const { id } = req.params;
        const getDataById = await Category.findById({ _id: id })
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
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.get('/delete/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const isNestedData = await Category.find({ parent_id: id });
        if (isNestedData.length > 0) {
            res.render('error', { error: 'Delete child categories first' });
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
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

// ************************** sub category ************************************

router.get('/add-category/:id', auth, (req, res) => {
    try {
        const { id } = req.params;
        res.render('add', { submit: `/add-category/${id}`, title: "Add Sub Category", data: '' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

router.get('/view/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const categoryData = await Category.find({ parent_id: id })
        const productWithNestedData = [];

        // Check nested data for each product
        for (const x of categoryData) {
            const isNestedData = await Category.find({ parent_id: x._id });
            if (isNestedData.length > 0) {
                productWithNestedData.push(x.id);
            }
        }
        const parentData = await Category.findById({ _id: id })
        const subCategoryData = await Category.find({ parent_id: id });
        res.render('view', { parentTitle: parentData.title, parent_id: id, product: subCategoryData, productWithNestedData, data: '' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

router.get('/delete-category/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteData = await Category.findByIdAndDelete({ _id: id })
        if (deleteData.image !== '628px-Ethereum_logo_2014 2.png') {
            fs.unlink('./public/uploads/' + `${deleteData.image}`, (err) => {
                if (err) {
                    throw err;
                }
                console.log("Delete File successfully.");
            });
        }
        res.redirect(`/`)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.get('/edit-category/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const editData = await Category.findById({ _id: id })
        res.render('edit', { data: editData, submit: `/edit-category/${id}`, title: "Edit Sub Category" })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.post('/edit-category/:id', auth, upload, async (req, res) => {
    try {
        const { id } = req.params;
        console.log('edit-category id', id)
        const getDataById = await Category.findById({ _id: id })
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
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})


router.post('/add-category/:id', upload, auth, async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            const data = {
                parent_id: id,
                ...req.body,
            }
            await Category.create(data)
            res.redirect(`/view/${id}`)
        }
        else {
            const data = {
                parent_id: id,
                ...req.body,
                image: req.file.filename
            }
            await Category.create(data);
            res.redirect(`/view/${id}`)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})


// **************************** product   **********************************

// add product pages 

router.get('/add-product', auth, (req, res) => {
    try {
        res.render('add-product', { data: "" })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.post('/get-category', auth, async (req, res) => {
    try {
        const category = await Category.find({parent_id : req.body.id == '' ? null : req.body.id});
        res.json(category);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.post('/add-product', auth, upload, async (req, res) => {
    try {
        const product = {
            ...req.body,
            image: req.file.filename
        }
        await Products.create(product)
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

// view product pages

router.get('/view-product', auth, (req, res) => {
    try {
        res.render('view-product', { product: '', data: '' });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.post('/get-product', auth, async (req, res) => {
    try {
        const products = await Products.find({ sub_category_id: req.body.id });
        res.json(products);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.get('/all-products', auth, async (req, res) => {
    try {
        const products = await Products.find()
        res.json(products)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.get('/edit-product/:id', auth, async (req, res) => {
    try {
        const { id } = req.params

        // Find the product by ID
        const productData = await Products.findById(id);

        // Check if the product is not found
        if (!productData) {
            return res.status(404).json({
                success: false,
                error: "Product not found",
            });
        }

        // Find the category by ID
        const categoryData = await Category.findById(productData.category_id);

        // Check if the category is not found
        if (!categoryData) {
            return res.status(404).json({
                success: false,
                error: "Category not found",
            });
        }

        // Find the subcategory by ID
        const subCategoryData = await Category.findById(productData.sub_category_id);

        // Check if the subcategory is not found
        if (!subCategoryData) {
            return res.status(404).json({
                success: false,
                error: "Subcategory not found",
            });
        }

        res.render('edit-product', { data: productData, category: categoryData.title, subCategory: subCategoryData.title });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.post('/edit-product/:id', auth, upload, async (req, res) => {
    try {
        const { id } = req.params
        const productData = await Products.findById({ _id: id })

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
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

router.get('/delete-product/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        await Products.findByIdAndDelete({ _id: id })
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
})

module.exports = router;