const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authControllers');

router.post('/signup', signup);
router.post('/login', login);

router.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

module.exports = router;