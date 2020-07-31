//Get the current time and date.

module.exports = function getDate() {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", options);
};
