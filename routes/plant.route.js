const express = require('express')
const router = express.Router()
const plant = require('../controllers/plant.controller')
const authentication = require('../middlewares/auth.middleware')
const { checkPermit, inProject, inPlant, inUser, inCompany } = require('../middlewares/permistion.middleware')

router.post('/',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inProject('body', 'employee')),
    plant.postPlant
)
router.get('/',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inProject('query', 'employee')),
    plant.getPlants
)

router.get('/:plantId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inPlant('body', 'employee')),
    plant.getPlant
)
router.put('/:plantId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inPlant('body', 'author')),
    plant.updatePlant
)
router.delete('/:plantId',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inPlant('body', 'author')),
    plant.deletePlant
)

router.post('/:plantId/change-user-role',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inPlant('body', 'manager')),
    plant.changeUserRole
)

router.post('/:plantId/move-to-trash',
    authentication.required,
    checkPermit(inCompany("self", "manager"), inPlant('body', 'author'), ),
    plant.setPlantInTrash
)

router.post('/:plantId/unmove-to-trash',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inPlant('self', 'author')),
    plant.unsetPlantInTrash
)

router.post('/:plantId/hidden',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inPlant('self', 'author')),
    plant.hiddenPlant
)

router.post('/:plantId/unhidden',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inPlant('self', 'author')),
    plant.unHiddenPlant
)

router.post('/:plantId/delete',
    authentication.required,
    checkPermit(inCompany('self', 'manager')),
    plant.deletePlant
)

router.post('/:plantId/add-members',
    authentication.required,
    checkPermit(inCompany('self', 'manager'), inPlant("self", "employee")),
    plant.addMembers
)

router.post('/:plantId/remove-member',
    authentication.required,
    checkPermit(inCompany("self", "manager")),
    plant.removeMember
)

module.exports = router