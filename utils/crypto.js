// utils/crypto.js
const crypto = require("crypto");

const JWT_SECRET = "jQAlLINmnELDxO7MRdj1f9xc05v1Buv1";

export function encryptString(str) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(JWT_SECRET), iv);
    let encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const encryptedPassword = iv.toString('hex') + ':' + encrypted;
    console.log("Encrypted Token is:", encryptedPassword)
    return encryptedPassword;
}
