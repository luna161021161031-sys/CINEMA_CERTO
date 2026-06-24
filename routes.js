const express = require('express')
const router = express.Router()

const AtualizadorController = require('./controllers/atualizadorController')
const IngressoController = require('./controllers/ingressoController')

router.post('/cadastrar', AtualizadorController.cadastrar)
router.post('/logar', AtualizadorController.logar)

router.post('/finalizar-reserva', IngressoController.finalizarReserva)
router.get('/meus-ingressos', IngressoController.meusIngressos)
router.get('/assentos-ocupados', IngressoController.assentosOcupados)
router.get('/usuarios', AtualizadorController.listarUsuarios)
router.get('/listar-usuarios', AtualizadorController.listarUsuarios)
router.delete('/deletar-usuario/:id', AtualizadorController.deletarUsuario)

module.exports = router