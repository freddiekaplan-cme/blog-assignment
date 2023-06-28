export const getAuthorFromEmail = (email) => {
  const authorFromEmail = email != undefined ? email.split("@")[0] : "";

  return authorFromEmail;
};
