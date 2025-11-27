import { ColorPicker } from "react-color-palette";

function handlehover(event, mode = "pen",color) {
  if (mode === "pen") {
    event.target.style.backgroundColor = color;
  }
  if (mode === "erase") {
    event.target.style.backgroundColor = "white";
  }
}   
export default handlehover;