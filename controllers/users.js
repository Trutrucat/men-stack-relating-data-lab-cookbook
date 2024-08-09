const User = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.render('users/index.ejs', { users })
    } catch (error) {
        console.error(error)
        res.redirect('/')
    }

});

router.get('/:id', async (req, res) => {
    try {
        const user= await User.findById(req.params.id)
        if (!user) {
            return res.redirect('/users')
        }
        res.render('users/show.ejs', { user })
    } catch (error) {
        console.error(error)
        res.redirect('/users')
    }
})

module.exports = router