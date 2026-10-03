const { Router } = require('express');
const router = Router();

// controladores
const { home, marco, ping } = require('../controllers/index.controller');
const { getUsers, createUser, login } = require('../controllers/users.controller');

// Rutas iniciales
router.get('/', home);
router.get('/marco', marco);
router.get('/ping', ping);

// Rutas de Usuarios y Login
router.get('/users', getUsers);
router.post('/users', createUser);
router.post('/login', login);

module.exports = router;