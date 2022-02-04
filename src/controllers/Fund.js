const { fund, userDonate, userFund, user } = require('../../models/index')
const Joi = require('joi')

exports.getFunds = async (req, res) => {
    try {
        const data = await fund.findAll({            
            include: [
                {
                    model: userDonate,
                    as: "userDonate",
                    include : [{
                        model: user,
                        as: "user",  
                    }]
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        let restData =[]
        data.map(fund => {
            let dataFund = {
                id: fund.id,
                title: fund.title,
                thumbnail: fund.thumbnail,
                goal: fund.goal,
                description: fund.description,
                usersDonate: []
            };
            fund.userDonate.map(donate => {
                dataFund.usersDonate.push({
                    id: donate.id,
                    fullName: donate.user.fullName,
                    email: donate.user.email,
                    donateAmount: donate.donateAmount,
                    status: donate.status,
                    proofAttachment: donate.proofAttachment
                })
            })
            restData.push(dataFund)
        })
        
        res.status(200).send({
            status: "success",
            data: { 'funds': restData }
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "error",
            message: "internal server error"
        })
    }
}

exports.getFundsByUserId =async (req, res) => {
    const {id} = req.user
    try {
        const data = await user.findOne({
            where: {id},            
            include: [
                {
                    model: fund,
                    as: "funds",
                }
            ],
        })
        
        if(!data) {
            return res.status(404).send({
                status: "failed",
                message: "user not found"
            })
        }

        res.status(200).send({
            status: "success",
            data: data.funds
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "error",
            message: "internal server error"
        })
    }   
}

exports.addFund = async (req, res) => {
    const data = req.body
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        goal: Joi.number().min(5).required(),
        description: Joi.string().min(5).required(),
    })
    const {error} = schema.validate(data)

    if(error) {
        return res.status(400).send({
            status: "error",
            message: error.details[0].message
        })
    }
    

    try {
        const newfund = await fund.create({
            title: req.body.title,
            goal: req.body.goal,
            description: req.body.description,
            thumbnail: req.file.filename
        })

        await userFund.create({
            userId: req.user.id,
            fundId: newfund.id
        })

        res.status(201).send({
            status: "success",
            data: {fund: {
                id: newfund.id,
                title: newfund.title,
                thumbnail: newfund.thumbnail,
                goal: newfund.goal,
                description: newfund.description,
                userDonate: []
            }}
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
}

exports.detailFund = async (req, res) => {
    const {id} = req.params

    try {
        const data = await fund.findOne({            
            where: {id},
            include: [
                {
                    model: userDonate,
                    as: "userDonate",
                    include : [{
                        model: user,
                        as: "user",  
                    }]
                }
            ],
        })

        if(!data) {
            return res.status(404).send({
                status: "failed",
                message: "fund not found",
            })
        }

        let restData =[]
        let dataFund = {
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            goal: data.goal,
            description: data.description,
            usersDonate: []
        };
        data.userDonate.map(donate => {
            dataFund.usersDonate.push({
                id: donate.id,
                fullName: donate.user.fullName,
                email: donate.user.email,
                donateAmount: donate.donateAmount,
                status: donate.status,
                proofAttachment: donate.proofAttachment,
                date: donate.createdAt
            })
        })
        restData.push(dataFund)

        res.status(200).send({
            status: "success",
            data: restData
        }); 
         
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "error",
            message: "internal server error"
        })
    }

}

exports.editFund = async (req, res) => {
    const data = req.body
    const schema = Joi.object({
        title: Joi.string().min(3),
        goal: Joi.number().min(5),
        description: Joi.string().min(5),
    })
    const {error} = schema.validate(data)

    if(error) {
        return res.status(400).send({
            status: "error",
            message: error.details[0].message
        })
    }
    try {
        const {id} = req.params  
        
        const datafund = await fund.findOne({
            where: {id}
        })
        
        if(!datafund) {
            return res.status(404).send({
                status: "failed",
                message: "fund not found"
            })
        }
        const thumbnail = req.file ? req.file.filename : datafund.thumbnail
        
        await fund.update({
            title: data.title,
            goal: data.goal,
            description: data.description,
            thumbnail: thumbnail
        },{
            where: {id}
        })
        const updatedfund = await fund.findOne({
            where: {id}
        })

        res.status(200).send({
            status: "success",
            data: {
                fund: {
                    id : updatedfund.id,
                    title : updatedfund.title,
                    thumbnail : updatedfund.thumbnail,
                    goal : updatedfund.goal,
                    description : updatedfund.description,
                    userDonate: []
                }
            }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
}


exports.deleteFund = async (req, res) => {
    const {id} = req.params
    try {
        const datafund = await fund.destroy({
            where: {id}
        })
        
        if(!datafund) {
            return res.status(404).send({
                status: "error",
                message: "fund not found"
            })   
        }

        res.status(200).send({
            status: "success",
            data: {id: id}
        })
    }catch (error) {
        console.log(error.message)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })               
    }
}


exports.editDonateFund = async (req, res) => {
    const {fundId, userDonateId} = req.params
    const dataInput = req.body
    try {
        const donateExist = await userDonate.findOne({
            where: {
                id: userDonateId,
                fundId : fundId,
            }
        })

        if(!donateExist) {
            return res.status(404).send({
                status: "error",
                message: "fund not found"
            })   
        }

        await userDonate.update(dataInput,{
            where: {
                id: userDonateId,
                fundId : fundId,
            }
        })

        const data = await fund.findOne({            
            where: {id : fundId},
            include: [
                {
                    model: userDonate,
                    as: "userDonate",
                    include : [{
                        model: user,
                        as: "user",  
                    }]
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        if(!data) {
            return res.status(404).send({
                status: "failed",
                message: "fund not found",
            })
        }

        let restData =[]
        let dataFund = {
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            goal: data.goal,
            description: data.description,
            usersDonate: []
        };
        data.userDonate.map(donate => {
            dataFund.usersDonate.push({
                id: donate.id,
                fullName: donate.user.fullName,
                email: donate.user.email,
                donateAmount: donate.donateAmount,
                status: donate.status,
                proofAttachment: donate.proofAttachment
            })
        })
        restData.push(dataFund)

        res.status(200).send({
            status: "success",
            data: restData
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })  
    }
}

exports.addUserDonate = async( req, res) => {
    const {fundId} = req.params
    const {id} = req.user
    const schema = Joi.object({
        fundId: Joi.number().required(),
        userId: Joi.number().required(),
        donateAmount: Joi.number().min(3).required(),
    })
    const {error} = schema.validate({
        fundId,
        userId : id,
        donateAmount:req.body.donateAmount
    })

    if(error) {
        return res.status(400).send({
            status: "error",
            message: error.details[0].message
        })
    }
    try {
        await userDonate.create({
            fundId,
            userId : id,
            donateAmount: req.body.donateAmount,
            proofAttachment: req.file.filename
        })

        const data = await fund.findOne({            
            where: {id : fundId},
            include: [
                {
                    model: userDonate,
                    as: "userDonate",
                    include : [{
                        model: user,
                        as: "user",  
                    }]
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })

        if(!data) {
            return res.status(404).send({
                status: "failed",
                message: "fund not found",
            })
        }

        let restData =[]
        let dataFund = {
            id: data.id,
            title: data.title,
            thumbnail: data.thumbnail,
            goal: data.goal,
            description: data.description,
            usersDonate: []
        };
        data.userDonate.map(donate => {
            dataFund.usersDonate.push({
                id: donate.id,
                fullName: donate.user.fullName,
                email: donate.user.email,
                donateAmount: donate.donateAmount,
                status: donate.status,
                proofAttachment: donate.proofAttachment
            })
        })
        restData.push(dataFund)

        res.status(201).send({
            status: "success",
            data: restData
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })          
    }
}

exports.detailUserDonate = async (req, res) => {
    const {fundId, userDonateId} = req.params

    try {
        const donateExist = await userDonate.findOne({
            where: {
                id: userDonateId,
                fundId : fundId,
            },
            include: [{
                model: user,
                as:'user'
            }]
        })

        if(!donateExist) {
            return res.status(404).send({
                status: "error",
                message: "fund not found"
            })   
        }
        
        res.status(201).send({
            status: "success",
            data: {
                id : donateExist.id,
                name : donateExist.user.fullName,
                amount : donateExist.donateAmount,
                image: donateExist.proofAttachment                
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
}

exports.getUsersDonate = async (req, res) => {
    const {id} = req.user

    try {
        const donateExist = await userDonate.findAll({
            where: {
                userId: id,
            },
            include: [{
                model: fund,
                as:'fund'
            }]
        })

        if(!donateExist) {
            return res.status(404).send({
                status: "error",
                message: "fund not found"
            })   
        }
        let restData =[]
        donateExist.map(donate => {
            let donateData = {
                id: donate.id,
                title: donate.fund.title,
                date: donate.createdAt,
                amount: donate.donateAmount,
                status: donate.status,
            };
            restData.push(donateData)
        })
        res.status(201).send({
            status: "success",
            data: restData
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "failed",
            message: "internal server error"
        })
    }
}