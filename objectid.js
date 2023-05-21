// Check the ObjectId
const mongoose = require("mongoose");

const id = new mongoose.Types.ObjectId();
console.log(id.getTimestamp());

const isValid = mongoose.Types.ObjectId.isValid("212321");
console.log(isValid);
