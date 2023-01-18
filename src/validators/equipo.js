const { check } = require('express-validator')
const { validateResult } = require('../helpers/validateHelper')

const validateCreate =[
    check('campo')
    .exists()
    .not()
    .isEmpty(),
    check('edad')
    .exists()
    .not()
    .custom((value,{ req }) => {
        if(value < 18 || value >40){
            throw new Error('Rango de Edad debe ser entre 18  y  40')
        }
    })
    .isEmpty(),
    check('email')
    .exists()
    .isEmail(),
    (req, res, next)=>{
        validateResult()
    }
    

     
]