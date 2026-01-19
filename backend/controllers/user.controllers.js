import User from "../models/user.model"
import bcrypt from "bcryptjs"

export const registerUser = async(req,res)=>{
    const {username, email, password} = req.body

    try {
        if (!username || !email || !password) {
            return res.status(422).json({message: "All Fields are Required"})
        }
        const findUser = await User.findOne({email});
        if (findUser) {
            return res.status(422).json({message: "Email Already Registered"})
        }
        const hashedPassword = await bcrypt.hashSync(password,8)

        const userdata = new User({
            username,
            email,
            password : hashedPassword
        })
        const user = await userdata.save() 
        const {password: pass,...rest} = user._doc;
        
        res.status(201).json({
            success:true,
            message: "User Registered Successfully",
            user: rest,
        })
    } catch (error) {
        console.log(error)
    }
}