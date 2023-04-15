const UserModel = require('../models/users.model');
const crypto = require('crypto');

exports.insert = (req, res) => {
    if(!req.body.user_id || !req.body.password || req.body.user_id.length === 0 || req.body.password.length === 0 ){
        res.status(400).send({
            "message": "Account creation failed",
            "cause": "required user_id and password"
        });
        return;
    }
    if(req.body.user_id.length < 6 || req.body.user_id.length > 20){
        res.status(400).send({
            "message": "Account creation failed",
            "cause": "user length must be between 6 and 20 characters"
        });
        return;
    }
    if(req.body.password.length < 8 || req.body.password.length > 20){
        res.status(400).send({
            "message": "Account creation failed",
            "cause": "password length must be between 6 and 20 characters"
        });
        return;
    }

    let myArray = /\w*/g.exec(req.body.user_id)
    if(myArray.length !== 1){
        res.status(400).send({
            "message": "Account creation failed",
            "cause": "user only accepts alphanumeric characters"
        });
        return;
    }
    myArray = /[$%&@#!.A-Za-z0-9]*/g.exec(req.body.password)
    if(myArray.length !== 1){
        res.status(400).send({
            "message": "Account creation failed",
            "cause": "password contains not valid characters"
        });
        return;
    }
    UserModel.findByUser_id(req.body.user_id)
        .then((existentUser) => {
            if(existentUser.length === 0){
                UserModel.createUser(req.body)
                    .then((result) => {
                        res.status(200).send({
                            "message": "Account successfully created",
                            user:{
                                user_id: result.user_id,
                                "nickname": result.user_id,
                            },
                    });
                });
            }else{
                res.status(400).send({
                    "message": "Account creation failed",
                    "cause": "already same user_id is used"
                });
            }
        });
};


exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    UserModel.findByUser_id(req.params.userId)
        .then((result) => {
            if(result){
                res.status(200).send({
                    "message": "User details by user_id",

                    "a":result,
                    "user": {
                        "user_id": result.user_id,
                        "nickname": result.user_id
                    }
                });
            }else{
                res.status(400).send({
                    "message": "No User found"
                  });
            }
        });
};
exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    UserModel.patchUser(req.params.userId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(200).send({
                "message": "Account and user successfully removed"
              });
              res.status(200).send({
                "message": "Authentication Failed"
              });
        });
};