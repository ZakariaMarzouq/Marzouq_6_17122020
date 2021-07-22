
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8) // Longueur minimale 8
.is().max(100) // Longueur maximale 100     
.has().uppercase() // Doit contenir des lettres majuscules
.has().lowercase() // Doit contenir des lettres minuscules 
.has().digits(2) // Doit avoir au moins 2 chiffres 
.has().not().spaces() // Ne devrait pas avoir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123', 'PasswOrd123']); // Blacklister ces valeurs

module.exports = passwordSchema;