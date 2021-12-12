export const getItemOrder = (leftSiblingOrder?: number, rightSiblingOrder?: number) => {
  // append to the start
  if (leftSiblingOrder == null && rightSiblingOrder != null) {
    return rightSiblingOrder - 1;
  }

  // append to the end
  if (rightSiblingOrder == null && leftSiblingOrder != null) {
    return leftSiblingOrder + 1;
  }

  // insert in between
  if (leftSiblingOrder != null && rightSiblingOrder != null) {
    return (leftSiblingOrder + rightSiblingOrder) / 2;
  }

  // first item in the list, order is 100 by default
  return 100;
};
