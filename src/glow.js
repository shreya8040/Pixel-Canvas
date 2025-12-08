import { ColorPicker } from "react-color-palette";
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}
function handlehover(event, mode = "pen",color) {
  if (mode === "pen") {
     event.target.style.backgroundColor = hexToRgb(color);
  }
  if (mode === "erase") {
    event.target.style.backgroundColor = "transparent";
  }
}   
export default handlehover;