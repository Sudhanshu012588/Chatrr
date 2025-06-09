import bcrypt, { hash } from 'bcrypt';


export const hashpassword = async(password)=>{
    const salt = 10;
    const hashpasswrod = await bcrypt.hash(password,salt);
    return hashpasswrod;
}