function generateUsername(name){

const random=Math.floor(Math.random()*1000)

return name.toLowerCase()+random

}

function generatePassword(){

const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#"

let pass=""

for(let i=0;i<8;i++){

pass+=chars.charAt(Math.floor(Math.random()*chars.length))

}

return pass

}

module.exports={generateUsername,generatePassword}