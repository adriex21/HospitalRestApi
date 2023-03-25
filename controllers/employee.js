const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken')
const moment = require('moment')
const bcrypt = require('bcryptjs');


const generateToken = (employeeId, expires, secret = 'secret') => {
    const payload = {
        sub:employeeId,
        iat:moment().unix(),
        exp:expires.unix(),
    };
    return jwt.sign(payload,secret);
};

const controller = {

    register: async(req, res) => {
        const{name,email,password,password2} = req.body;
        let errors = [];

        if(!name || !email || !password || !password2) {
            error.push({msg: 'Fill all the fields'});
        }

        if (!email.includes("@") || !email.includes(".")) {
            errors.push({ msg: 'Invalid email format' });
        }

        if (password != password2) {
            errors.push({ msg: 'Passwords not matching' });
        }

        if(errors.length > 0) {
            res.send(errors)
        } else {
            Employee.findOne({email:email}).then(employee => {
                if(employee) {
                    errors.push({msg: 'Email already used'});
                    res.send({msg:'Employee already exists'});
                } else {
                    const newEmployee = new Employee({
                        name,
                        email,
                        password
                    });

                    bcrypt.genSalt(10, (err,salt)=>{
                        bcrypt.hash(newEmployee.password, salt, (err,hash) => {
                            if(err) throw err;
                            newEmployee.password=hash;
                            newEmployee
                            .save()
                            .then(employee=>{
                                res.send({msg:'Employee was created'});
                            })
                            .catch(err=>console.log(err))
                        })
                    })
                }
            })
        }
    },


    login: async (req, res) => {
        try {
            let employee = await Employee.findOne({email: req.body.email } )
            let valid = await bcrypt.compare(req.body.password, employee.password);

            if (valid) {
                const expires = moment().add(10, 'days');
                const token = generateToken(employee._id, expires);
                res.send({ ok: true, id: employee._id, token:token });

                
            } else {
                res.send({ ok: false, msg: 'Password/email doesnt match' });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

   
}
    
    


module.exports = controller;