const bcrypt=require('bcrypt')

async function HashPassword(password) {
    const hashedPassword=await bcrypt.hash(password,10)
    return hashedPassword
}
async function comparePassword(PlainTextPassword,DatabasePassword) {
    const result=await bcrypt.compare(PlainTextPassword,DatabasePassword)
    return result
}
module.exports={
    comparePassword,
    HashPassword
}