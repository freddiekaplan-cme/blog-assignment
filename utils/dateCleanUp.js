export const dateCleanUp = (date) => {
  let cleanDate = date;

  if (date != undefined) {
    cleanDate = date.slice(0, 10) + " " + date.slice(11, 16);
  } else {
    cleanDate = "";
  }

  return cleanDate;
};
