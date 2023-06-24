export const createSlug = (title) => {
  const alphanumericTitle = title
    .replace(/[^a-zA-Z0-9åäöÅÄÖ ]/g, "")
    .replace(/å/gi, "a")
    .replace(/ä/gi, "a")
    .replace(/ö/gi, "o");
  return alphanumericTitle.split(" ").join("-").toLowerCase();
};
