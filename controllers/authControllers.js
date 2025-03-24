const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Este e-mail já está cadastrado',
        cause: 'email_duplicate',
        details: 'Não é possível criar uma conta com um e-mail que já está em uso'
      });
    }

    const newUser = await User.create({ username, email, password });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ 
      error: err.message,
      cause: err.code || 'validation_error',
      details: err.errors ? Object.values(err.errors).map(e => e.message) : 'Erro ao criar usuário'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas',
        cause: 'login_error',
        details: 'Credenciais inválidas'
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Credenciais inválidas',
        cause: 'login_error',
        details: 'Credenciais inválidas'
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ 
      error: err.message,
      cause: 'authentication_error',
      details: 'Erro durante o processo de autenticação'
    });
  }
};