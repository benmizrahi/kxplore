String.prototype.replaceAll = function (find, replace) {
  var str = this;
  return str.replace(new RegExp(find, 'g'), replace);
};

function getObjectType(obj) {
  return Object.prototype.toString.call(obj);
}
function isDate(obj) {
  return getObjectType(obj) === '[object Date]';
}
function isString(obj) {
  return getObjectType(obj) === '[object String]';
}
function isDateString(obj) {
  return isString(obj) && !isNaN(Date.parse(obj))
}
function isNumber(obj) {
  return typeof obj === 'number'
}
function parseDateFromString(str) {
  return Date.parse(str)
}
function isExpression(str) {
  if(str.match(/".*->.*"/)){
    return true
  }
  else{
    return false
  }
}
module.exports = {
  getObjectType: getObjectType,
  isDate: isDate,
  isString: isString,
  isDateString: isDateString,
  parseDateFromString: parseDateFromString,
  isNumber: isNumber,
  isExpression:isExpression
}
