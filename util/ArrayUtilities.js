const ArrayUtilities = {};

ArrayUtilities.randomElement = array => array[Math.floor(Math.random() * array.length)];

ArrayUtilities.remove = (element, array) => {
  let answer = array;
  const index = array.indexOf(element);

  if (index > -1) {
    answer = [...array]; // new array copy
    answer.splice(index, 1);
  }

  return answer;
};

Object.freeze(ArrayUtilities);

export default ArrayUtilities;
