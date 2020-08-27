"use strict";

const uniqueMessage = (error) => {
  let output;
  try {
    let fieldName = error.message.substring(
      error.message.lastIndexOf(".$") + 2,
      error.message.lastIndexOf("_1")
    );
    output =
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      " already exists";
  } catch (ex) {
    output = "Unique field already exists";
  }

  return output;
};
const duplicateMessage = (error) => {
  let output;
  try {
    console.log(error.errmsg);
    let fieldName = error.errmsg.substring(0, error.errmsg.lastIndexOf(":"));
    let fieldName2 = fieldName.substring(fieldName.lastIndexOf(" "));
    console.log(fieldName2);
    output = fieldName2.slice(1) + " already exists";
    console.log(output);
  } catch (ex) {
    output = "Unique field already exists";
  }

  return output;
};
exports.errorHandler = (error) => {
  let message = "";

  if (error.code) {
    switch (error.code) {
      case 11000:
        message = duplicateMessage(error);
        break;
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (let errorName in error.errorors) {
      if (error.errorors[errorName].message)
        message = error.errorors[errorName].message;
    }
  }

  return message;
};
