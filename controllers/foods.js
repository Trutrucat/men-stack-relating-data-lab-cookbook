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

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.session.user._id
        const itemId = req.params.id
        const user = await User.findById(userId)
        if (!user) {
            return res.redirect('/')
        }
        user.pantry.pull({ _id: itemId })
        await user.save()
        res.redirect(`/users/${userId}/foods`)     
    }catch (error) {
        console.error(error)
        res.redirect('/')   
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const userId = req.session.user._id
        const itemId = req.params.id
        const user = await User.findById(userId)
        
        if (!user) {
            return res.redirect('/')
        }

        const pantryItem = user.pantry.id(itemId)
        if (!pantryItem) {
            return res.redirect('/')
        }
        res.render('foods/edit.ejs', { user: req.session.user, food: pantryItem })    
    }catch (error) {
        console.error(error)
        res.redirect('/')   
    }
})
router.put('/:id', async (req, res) => {
    try {
        const userId = req.session.user._id
        const itemId = req.params.id
        const user = await User.findById(userId)
        if(!user) {
            return res.redirect('/')
        }
        const pantryItem = user.pantry.id(itemId)
        if (!pantryItem) {
            return res.redirect('/')
        }
        pantryItem.food = req.body.food
        pantryItem.isInPantry = req.body.isInPantry === 'on' || req.body.isInPantry === true
        await user.save()
        res.redirect(`/users/${userId}/foods`)
    } catch (error) {
        console.error(error)
        res.redirect('/')
    }
})

router.post('/', async (req, res) => {
   
        req.body.isInPantry === 'on' || req.body.isInPantry === true?
        req.body.isInPantry = true:
        req.body.isInPantry = false 
        try { 
        const foundUser = await User.findById(req.session.user._id)
        foundUser.pantry.push(req.body)
        await foundUser.save()
        res.redirect(`/users/${foundUser._id}/foods`)
    } catch (error) {
        res.redirect('/')
    }
});



module.exports = router;
