const express = require('express')
const router = express.Router()
const comment = require('../controllers/comment.controller')
const authentication = require('../middlewares/auth.middleware')

router.post('/',
    authentication.required,
    comment.postComment
)

router.put('/:commentId',
    authentication.required,
    comment.updateComment
)

router.delete('/:commentId',
    authentication.required,
    comment.deleteComment
)

router.get('/',
    authentication.required,
    comment.getComments
)

router.get('/:commentId',
    authentication.required,
    comment.getComment
)

module.exports = router