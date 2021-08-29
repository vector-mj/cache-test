import { Schema ,model} from "mongoose";
interface userDoc{
    username:string,
    password:string,
    avatar:string
}
const userModel = new Schema<userDoc>({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,    
    },
    avatar:{
        type:String,
        required:true
    }

})

export const User = model('users',userModel);
