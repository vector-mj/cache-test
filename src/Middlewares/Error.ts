import {Request,Response,NextFunction} from 'express';

export default (err:Error,req:Request,res:Response,next:NextFunction)=>{
    if(err){
        return res.status(400).send({
            Status:"Error",
            msg:err.message
        })
    }
}