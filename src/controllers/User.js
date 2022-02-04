const {user} = require('../../models/index');

exports.getUsers = async(req,res) => {
    try {
        const users = await user.findAll({
            attributes: {
                exclude: ['createdAt','updatedAt','password']
            }
        });
        res.status(200).send({
            status: "success",
            data: {users}
        })
    }catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })       
    }
}

exports.detailUser = async(req, res) => {    
    const {id} = req.user
    try {
        const User = await user.findOne({
            where: {id},
            attributes :{
                exclude: ['createdAt','updatedAt','password']
            }

        })
        
        if(!User) {
            return res.status(404).send({
                status: "error",
                message: "User not found",
            })   
        }

        res.status(200).send({
            status: "success",
            data: User
        })
    }catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })               
    }
}

exports.deleteUser = async(req, res) => {    
    const {id} = req.params
    try {
        const User = await user.destroy({
            where: {id}
        })
        
        if(!User) {
            return res.status(404).send({
                status: "error",
                message: "User not found",
            })   
        }

        res.status(200).send({
            status: "success",
            data: {id: id}
        })
    }catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })               
    }
}
exports.editProfile = async (req, res) => {
    const dataInput = req.body
    const {id} = req.user
    try {
        const userExist = await user.findOne({
            where: {id}
        })

        if(!userExist) {
            return res.status(404).send({
                status: "error",
                message: "user not found"
            })   
        }

        const image = req.file ? req.file.filename : userExist.image

        await user.update({
            fullName : dataInput.fullName,
            email: dataInput.email,
            phone: dataInput.phone,
            image: image
        },{
            where: {id}
        })

        const data = await user.findOne({            
            where: {id},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        res.status(200).send({
            status: "success",
            data
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })  
    }
}
