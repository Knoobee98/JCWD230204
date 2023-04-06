const bcrypt = require('bcrypt')
const saltRounds = 10
// tambahkan env biar lebih aman
// yang dimasukan di env data-data sensitif seperti : port, password, dsb

const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        return null;
    }
};

const hashMatch = async (passwordFromLogin, hashedPasswordFromDatabase) => {
    try {
      let match = await bcrypt.compare(passwordFromLogin, hashedPasswordFromDatabase);
      return match;
    } catch (error) {
      return false;
    }
  };
  
  module.exports = {
      hashPassword, hashMatch
  }