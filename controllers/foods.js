// controllers/foods.js
const User = require('../models/user.js');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const foundUser= await User.findById(req.session.user._id)
        if (!foundUser) {
            return res.redirect('/');
        }
        res.locals.pantryItems = foundUser.pantry || []
        res.render('foods/index.ejs')

    }catch (error) {
        console.error(error)
        res.redirect('/')
    } 
});

router.get('/new', (req, res) => {
    res.render('foods/new.ejs',{ user: req.session.user })  
});

router.post('/', async (req, res) => {
    try { 
        const foundUser = await User.findById(req.session.user._id)
        if (!foundUser) {
            return res.redirect('/');
        }
        const newFoodItem = {
            food: req.body.food,
            isInPantry: req.body.isInPantry === 'true'
        }
    
        foundUser.pantry.push(newFoodItem)
        await foundUser.save()
        res.redirect(`/users/${foundUser._id}/foods`)
    } catch (error) {
        res.redirect('/')
    }
});

module.exports = router;
