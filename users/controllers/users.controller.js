const UserModel = require('../models/users.model');
const crypto = require('crypto');
exports.default = (req,res) => {
    res.status(200).send({});

}
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
                                "user_id": result.user_id,
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

exports.getById = (req, res) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    UserModel.findByUser_id(login).then((result) => {
        if(result.length === 0 || result[0].password !== password) {
            res.status(401).send({
                "message": "Authentication Failed"
            });
        }
        UserModel.findByUser_id(req.params.userId)
        .then((result) => {
            if(result.length > 0){
                res.status(200).send(result[0].comment && result[0].comment.length > 0 ? {
                    "message": "User details by user_id",
                    "user": {
                        "user_id": result[0].user_id,
                        "nickname": result[0].nickname && result[0].nickname.length > 0 ? result[0].nickname : result[0].user_id,
                        "comment": result[0].comment,
                    }
                }:{
                    "message": "User details by user_id",
                    "user": {
                        "user_id": result[0].user_id,
                        "nickname": result[0].nickname && result[0].nickname.length > 0 ? result[0].nickname : result[0].user_id,
                    }
                });
            }else{
                res.status(400).send({
                    "message": "No User found"
                });
            }
        });
    })
};
exports.patchById = (req, res) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    UserModel.findByUser_id(login).then((result) => {
        if(result.length === 0 || result[0].password !== password) {
            res.status(401).send({
                "message": "Authentication Failed"
            });
        }
        if((!req.body.nickname && !req.body.comment) || (req.body.nickname.length === 0 && req.body.comment.length === 0)){
            res.status(400).send({
                "message": "User updation failed",
                "cause": "required nickname or comment"
            });
            return;
        }
        if(login !== req.params.userId){
            res.status(400).send({
                "message": "No Permission for Update"
            });
            return;
        }
        if(req.body.user_id && req.body.user_id.length > 0 || req.body.user_id && req.body.password.length > 0 ){
            res.status(400).send({
                "message": "User updation failed",
                "cause": "not updatable user_id and password"
            });
            return;
        }
        UserModel.patchUser(req.params.userId, req.body)
            .then((result) => {
                res.status(200).send({
                    "message": "User successfully updated",
                    "recipe": [
                      {
                        "nickname": result.nickname,
                        "comment": result.comment ? result.comment : ""
                      }
                ]
            });
        });
    });
};

exports.removeById = (req, res) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    UserModel.findByUser_id(login).then((result) => {
        if(result.length === 0 || result[0].password !== password) {
            res.status(401).send({
                "message": "Authentication Failed"
            });
        }
        UserModel.removeById(req.params.userId)
            .then((result)=>{
                res.status(200).send({
                    "message": "Account and user successfully removed"
            });
        });
    });
};