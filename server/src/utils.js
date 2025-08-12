function getRandomColor() {
  // Generate random RGB components with a minimum value of 128 to ensure brightness
  const r = Math.floor(Math.random() * 128) + 128; // Range from 128 to 255
  const g = Math.floor(Math.random() * 128) + 128;
  const b = Math.floor(Math.random() * 128) + 128;

  // Convert RGB to hex and return the color string
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function getInitials(value) {
  if (value && value.trim().length) {
    if (value.length > 1) return value.slice(0, 2);
    else return value.slice(0, 1);
  }

  return "😊";
}

module.exports = {
  getRandomColor,
  getInitials
};
