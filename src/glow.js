function handlehover(event, mode = "pen") {
  if (mode === "pen") {
    event.target.style.backgroundColor = "rgba(7, 29, 46, 1)";
  }
  if (mode === "erase") {
    event.target.style.backgroundColor = "white";
  }
}
export default handlehover;