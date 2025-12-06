
import './App.css';
import handlehover  from './glow';
import { useState, useEffect } from 'react';
import {  useColor } from "react-color-palette";
import { ChromePicker,CompactPicker } from 'react-color';
import "react-color-palette/dist/css/rcp.css";
import html2canvas from "html2canvas";

function App() {
  const cells = Array.from({ length: 1200} );
  const [isdrawing, setIsDrawing] = useState(false);
  const [checked, setchecked] = useState(true);
  const [pen, setpen] = useState(true);
  const [erase, seterase] = useState(false);
  const [color, setColor] = useColor("hex", "#121212");
  const[history,sethistory]=useState([]);
  const [redostack, setRedostack] = useState([]);
  const[dropper,setdropper]=useState(false);
  const[fill,setfill]=useState(false);
      useEffect(() => {
      const initialSnapshot = Array.from(document.querySelectorAll(".cell"))
        .map(cell => cell.style.backgroundColor);
      sethistory([initialSnapshot]);
         }, []);

       const saveHistory = () => {
        const cells = document.querySelectorAll(".cell");
        const snapshot = Array.from(cells).map(cell => cell.style.backgroundColor);
        
          sethistory(previous => [...previous, snapshot]);
          setRedostack([]);
        };

            const handlemousedown = (e) => {
            if (dropper) return;   
            setIsDrawing(true);
            handlehover(e, pen ? "pen" : "erase", color.hex);
            if (fill) return; 
          };
          const handlemouseup = () =>{
          setIsDrawing(false);
          if (isdrawing) {
          saveHistory();   // save the stroke snapshot
          
        }
              }
        const handledraw = (e) =>{
          if (fill) return; 
          if(isdrawing){
            handlehover(e,pen ? "pen" : "erase", color.hex);
          }
        }
        const clearGrid = () => {
        document.querySelectorAll(".cell").forEach(cell => {
          cell.style.backgroundColor = "white";  
        });
        };
      const handleresethover = (event) => {
        event.target.style.backgroundColor="rgba(255, 100, 100, 1)";
      }
      const handleresetleave =(event) =>{
        event.target.style.backgroundColor="white";
      }
      
      const undo = () => {
      if (history.length <= 1) return; 
      const last = history[history.length - 1]; 
      const previous = history[history.length - 2];
       setRedostack([...redostack, last]); 
      sethistory(history.slice(0, -1));
     
      const cells = document.querySelectorAll(".cell");
      previous.forEach((color, i) => {
        cells[i].style.backgroundColor = color;
        });
      };

      const redo =() => {
        if (redostack.length === 0) return;
        const next = redostack[redostack.length - 1];
        
        sethistory(history => [...history, next]);
        setRedostack(redostack.slice(0, -1));
        
        const cells = document.querySelectorAll(".cell");
        next.forEach((color, i) => {
          cells[i].style.backgroundColor = color;
          });
      }
      const handlehoverundo = (event) => {
        event.target.style.backgroundColor = "#9fd4f3";
      }
      const handleleaveundo =(event) =>{
        event.target.style.backgroundColor = "white";
      }
              function rgbtohex(rgb) {
          const matches = rgb.match(/\d+/g);
          if (!matches) return "#000000";  // IMPORTANT FIX
          return (
            "#" +
            matches
              .map(n => Number(n).toString(16).padStart(2, "0"))
              .join("")
          );
        }
            const handledropper = (event) => {
            if (!dropper) return;   // ← dropper must be active

            const rgb = window.getComputedStyle(event.target).backgroundColor;
            const matches = rgb.match(/\d+/g);
            if (!matches) return;

            const [r, g, b] = matches.map(Number);
            const hex = rgbtohex(rgb);

            setColor({
              hex: hex,
              rgb: { r, g, b },
              hsv: color.hsv
            });

            setdropper(false); // optional: turn off automatically after picking
          };
          const handlefill = (event) => {
            if (!fill) return;
            setpen(false);
            seterase(false);
            const cells = Array.from(document.querySelectorAll(".cell"));
            const index1 = cells.indexOf(event.target);
            filltool(index1, color.hex);
            saveHistory();
          }

        function filltool(startindex, fillcolor) {
        const cells = document.querySelectorAll(".cell");
        let origincolor= cells[startindex].style.backgroundColor;
          if (origincolor === fillcolor) return; 
        const col = 40;
        const rows = 30;
        const pixelCount = col * rows;
        const queue = [startindex];
        while(queue.length>0){
          const index = queue.shift();
          if(cells[index].style.backgroundColor === origincolor) 
          {
            cells[index].style.backgroundColor = fillcolor;
            const up =index-col;
            const down = index+col;
            const left = (index % col !==0) ? index-1 : -1;
            const right = (index % col !== col-1) ? index+1 : -1;
            if(up >=0) queue.push (up);
            if(down < pixelCount) queue.push (down);
            if(left !== -1) queue.push (left);
            if(right !== -1) queue.push (right);
            
          }
        }
        
        }
        const savePNG =() => {
          const gridimg = document.querySelector('.long1');
            const cells = document.querySelectorAll(".cell");
          if(!gridimg) return;
          cells.forEach(c => c.style.border = "none");
          html2canvas(gridimg , { backgroundColor: null, scale: 1 }).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'pixel-canvas.png';
            link.href = canvas.toDataURL();
            link.click();
             cells.forEach(c => {
              c.style.border = checked ? "0.2px solid #d6d6d6" : "none";
                });
          });
                }
                const saveSVG = () => {
          const cells = document.querySelectorAll(".cell");
          if (!cells.length) return;

          const cols = 40;        // number of columns in your grid
          const pixelSize = 15;   // width/height of each cell in px (match your CSS)

          const rows = Math.ceil(cells.length / cols);

         let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * pixelSize}" height="${rows * pixelSize}" shape-rendering="crispEdges">`;


          cells.forEach((cell, i) => {
            const color = window.getComputedStyle(cell).backgroundColor;
            const x = (i % cols) * pixelSize;
            const y = Math.floor(i / cols) * pixelSize;

            svg += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
          });
          svg += "</svg>";
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = "pixel-art.svg";
          link.click();

          URL.revokeObjectURL(url);
        };

  return (
     <div className="body">
     <div className="App" onMouseUp={handlemouseup}>
      <div className="title">Pixel Canvas</div>
      <div className={`long1 ${checked ? "grid-on" : "grid-off"}`} onMouseUp={handlemouseup}>
        {cells.map((_, index) => (
          <div 
            key={index}
            className="cell"
            style={{ backgroundColor: "white" }} 
            draggable="false"
            onPointerUpCapture={handlemouseup}
            onPointerDown={handlemousedown}
            onPointerEnter={handledraw}
               onClick={(e) => {
                  if (dropper) handledropper(e);
                  else if (fill) handlefill(e);
              }}
            >
           </div>
          ))}
      </div>
      <button className={`toggle1 ${checked?"active":""}`}onClick={()=>setchecked(!checked)}> <div className='gridtext'>Grid</div> </button>
      <button className='reset' onPointerEnter={handleresethover} onPointerLeave={handleresetleave} onClick={clearGrid}><div className='gridtext'>Reset</div></button>
      <button className={`pen ${pen?"active":""}`}onClick={()=>setpen(true) & seterase(false) & setColor(color) & setfill(false) }><div className='gridtext'>Pencil</div></button>
      <button className={`erase ${erase?"active":""}`}onClick={()=>seterase(true) & setpen(false) & setfill(false)}><div className='gridtext'>Eraser</div></button>
      <div className='colorwrap'><ChromePicker
                backgroundColor={"#fbfbfb"}
                width={150}
                height={170}
                color={color}
                onChange={setColor}
              /></div>
      <button className='undo' onClick={undo} onMouseEnter={handlehoverundo} onMouseLeave={handleleaveundo}><div className='gridtext'>Undo</div></button>
      <button className='redo' onClick={redo}onMouseEnter={handlehoverundo} onMouseLeave={handleleaveundo}><div className='gridtext'>Redo</div></button>
      <button className={`dropper ${dropper?"active":""}`}onClick={()=>setdropper(true) & setfill(false)} ><div className='gridtext'>Dropper</div></button>
      <button className={`fill ${fill?"active":""}`}onClick={()=>setfill(!fill) & setColor(color) & setpen(false) & seterase(false) & setdropper(false)  }><div className='gridtext'>Fill</div></button>
      <div className='compactwrap'><CompactPicker backgroundColor={"#fbfbfb"}
            color={color.hex}
             onChange={(c) => setColor({ ...color, hex: c.hex })}
      /></div>
      <div className='welcomenote'>Hello and welcome to Pixel Canvas!</div>
      <div className='welcometext'>Taking inspiration from the OG MS-paint, Pixel Canvas is a tool designed to help you create cute pixel-themed icons and doodles</div>
      <div className='save'>Save as : <button className='png' onClick={savePNG}>PNG</button></div>
      <div className='save'>Save as : <button className='svg' onClick={saveSVG}>SVG</button></div>
      <div className='suggest'>Got a suggestion? Drop them here<button className='suggestbutton'>↓</button></div>
      <div className='suggestbox'><button className='sendbutton'></button></div>
      </div>
      
    </div>
  );
}
 

export default App;
