const ArrayUtilities = {};

ArrayUtilities.randomElement = array => array[Math.floor(Math.random() * array.length)];

ArrayUtilities.remove = (element, array) => {
  let answer = array;
  const index = array.indexOf(element);

  if (index > -1) {
    answer = [].concat(array); // new array copy
    answer.splice(index, 1);
  }

  return answer;
};

// DEPRECATED: Use Ramda.without directly.
ArrayUtilities.removeAll = (element, array) => {
  return R.without([element], array);
};

Object.freeze(ArrayUtilities);

export default ArrayUtilities;
