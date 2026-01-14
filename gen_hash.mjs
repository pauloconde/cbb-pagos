import { Scrypt } from "oslo/password";
const scrypt = new Scrypt();
const hash = await scrypt.hash("123456"); // Password: admin
console.log(hash);
