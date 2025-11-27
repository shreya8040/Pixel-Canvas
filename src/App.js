
import './App.css';
import handlehover  from './glow';
import { useState, useEffect } from 'react';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/dist/css/rcp.css";


function App() {
  const cells = Array.from({ length: 1200} );
  const [isdrawing, setIsDrawing] = useState(false);
  const [checked, setchecked] = useState(true);
  const [pen, setpen] = useState(true);
  const [erase, seterase] = useState(false);
  const [color, setColor] = useColor("hex", "#121212");
  const[history,sethistory]=useState([]);
  const [redostack, setRedostack] = useState([]);

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

       const handlemousedown = (e) =>{    
                  
        setIsDrawing(true);
        handlehover(e,pen ? "pen" : "erase", color.hex);  
        
         
        }
        const handlemouseup = () =>{
          setIsDrawing(false);
          if (isdrawing) {
    saveHistory();   // save the stroke snapshot
  }
        }
        const handledraw = (e) =>{
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
        event.target.style.backgroundColor = "#7fc6ef";
      }
      const handleleaveundo =(event) =>{
        event.target.style.backgroundColor = "white";
      }
  
  

  return (
    <div className="body">
    <div className="App" onMouseUp={handlemouseup}>
      <div className="title">Pixel Canvas</div>
      <div className={`long1 ${checked ? "grid-on" : "grid-off"}`} onMouseUp={handlemouseup}>
        {cells.map((_, index) => (
          <div 
            key={index}
            className="cell"
            draggable="false"
            onPointerUpCapture={handlemouseup}
            onPointerDown={handlemousedown}
            onPointerEnter={handledraw}
            >
           </div>
          ))}
      </div>
      <button className={`toggle1 ${checked?"active":""}`}onClick={()=>setchecked(!checked)}> <div className='gridtext'>Grid</div> </button>
      <button className='reset' onPointerEnter={handleresethover} onPointerLeave={handleresetleave} onClick={clearGrid}><div className='gridtext'>Reset</div></button>
      <button className={`pen ${pen?"active":""}`}onClick={()=>setpen(!pen) & seterase(!erase) & setColor(color) }><div className='gridtext'>Pen</div></button>
      <button className={`erase ${erase?"active":""}`}onClick={()=>seterase(!erase) & setpen(!pen)}><div className='gridtext'>Eraser</div></button>
      <div className='colorwrap'><ColorPicker
                width={150}
                height={170}
                color={color}
                onChange={setColor}
              /></div>
      <button className='undo' onClick={undo} onMouseEnter={handlehoverundo} onMouseLeave={handleleaveundo}><div className='gridtext'>Undo</div></button>
      <button className='redo' onClick={redo}onMouseEnter={handlehoverundo} onMouseLeave={handleleaveundo}><div className='gridtext'>Redo</div></button>
      </div>
    </div>
  );
}
 

export default App;
