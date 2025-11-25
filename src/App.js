
import './App.css';
import handlehover  from './glow';
import { useState } from 'react';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/dist/css/rcp.css";


function App() {
  const cells = Array.from({ length: 1200} );
  const [isdrawing, setIsDrawing] = useState(false);
  const [checked, setchecked] = useState(true);
  const [pen, setpen] = useState(true);
  const [erase, seterase] = useState(false);
  const handlemousedown = (e) =>{
    setIsDrawing(true);
    handlehover(e,pen ? "pen" : "erase");
  }
  const handlemouseup = () =>{
    setIsDrawing(false);
  }
  const handledraw = (e) =>{
    if(isdrawing){
      handlehover(e,pen ? "pen" : "erase");
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
  const [color, setColor] = useColor("hex", "#121212"); 


  
 
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
      <button className={`pen ${pen?"active":""}`}onClick={()=>setpen(!pen) & seterase(!erase) }><div className='gridtext'>Pen</div></button>
      <button className={`erase ${erase?"active":""}`}onClick={()=>seterase(!erase) & setpen(!pen)}><div className='gridtext'>erase</div></button>
     <div className='colorwrap'><ColorPicker
                width={150}
                height={150}
                color={color}
                onChange={setColor}
              /></div>
    
    </div>
       
    </div>
  );
}
 

export default App;
