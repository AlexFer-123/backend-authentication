const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  try {
    // Obter token do cabeçalho
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Acesso não autorizado');

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
  
};