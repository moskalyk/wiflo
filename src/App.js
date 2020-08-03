import React, { useState, useEffect }from 'react';
import logo from './logo.svg';
import './App.css';

import Player from './Player'

import Space from './Space'
import Aura from './Aura'

import less from './imgs/less_1.png'
import more from './imgs/more_1.png'
import line from './imgs/line.png'

// function Space () {
//   return (<div></div>)
// }

function launchSpace(){
  console.log('howdie')
}

let key = 0;
let i = ["⤶", "⤈" ,"⤷"]
let LAYERS = [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff1100, 1 ], [ 0.6, 0xffaa00, 0.75 ]]
let LAYERS1 = [[ 0.25, 0xff7900, 1 ], [ 0.5, 0xfa1100, 1 ], [ 0.6, 0xffa900, 0.75 ]]
let LAYERS2 = [[ 0.25, 0xff7200, 1 ], [ 0.6, 0x20B2AA, 0.75 ]]
let LAYERS3 = [[ 0.5, 0x7CFC00, 1 ], [ 0.6, 0xffaa00, 0.75 ]]
  
function State (props) {

  return (
      <div className="space" onClick={() =>{
        console.log('setting room')
        props.setState(UI_STATES.ROOM)
      }
      }> {
        (key < 1) ? (
          <div>
            <img src={less} width={"50%"} style={{display: 'inline-block'}}/>
            <span style={{display: 'inherit'}}>
            <br />
            {i[key++]}
            {"  "}
            {props.count}
            </span>
          </div>
        ) : (
          <div>
          <img src={key == 1 ? line : more} width={"50%"} style={{display: 'inline-block'}}/>
            <span style={{display: 'inherit'}}>
          <br />
          {props.count}
          {"  "}
          {i[key++]}
          </span>
          </div>
        )
      }
      </div>
    )
}

function Header(props){
  return(
    <div className='header'>
      wiflo°
      <div style={{color: 'grey', paddingTop: '10px'}}>
        about us
      </div>
    </div>
    )
}

function Footer(props){
  
  const globalToggle = React.useCallback(() => {
    props.setControl(SPACE_STATE.GLOBAL)
    key = 0
  });
  
  const flowToggle = React.useCallback(() => {
    props.setControl(SPACE_STATE.FLOW)
    key = 0
  });
  
  const selfToggle = React.useCallback(() => {
    props.setControl(SPACE_STATE.LOCAL)
    key = 0
  });
  
  return(
    <div className='footer'>
      <a style={{textDecoration: 'none', color: 'grey', cursor: 'pointer'}}>
        <span onClick={globalToggle}>◯&nbsp;&nbsp;&nbsp;JOIN&nbsp;&nbsp;&nbsp;</span>
      </a>
      {"|"}
      <a style={{textDecoration: 'none', color: 'grey', cursor: 'pointer'}}>
        <span onClick={flowToggle}>&nbsp;&nbsp;&nbsp;▲&nbsp;&nbsp;&nbsp;START&nbsp;&nbsp;&nbsp;▲&nbsp;&nbsp;&nbsp;</span>
      </a>
      {"|"}
      <a style={{textDecoration: 'none', color: 'grey', cursor: 'pointer'}}>
        <span onClick={selfToggle}>&nbsp;&nbsp;&nbsp;SELF&nbsp;&nbsp;&nbsp;Σ</span>
      </a>
    </div>
    )
}

function Here() {
  return (
      <div className="here"></div>
    )
}

function Intention(props){
   const [isGo, setGo] = useState(true);
   
  return(
      <div className='intent'>
        <input style={{alignText: 'center'}} type="text" name="intention=v1" placeholder="set intention" className="intention"/>
        <br/>
        <button className="but"
          onMouseEnter={() => setGo(false)}
          onMouseLeave={() => setGo(true)}
          onClick={() => props.setState(UI_STATES.NAV)}
        >»</button>
      </div>
    )
}

function Room(){
  const [dots, setDots] = useState('waiting');
  const [participants, setParticipants] = useState([]);
  console.log('in the room')
  // const participants = this.props.particapants
  
  // const participants = [
  //     [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff1100, 1 ], [ 0.75, 0xffaa00, 0.75 ]],
  //     // [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff9900, 1 ], [ 0.75, 0xffaa00, 0.75 ]]
  //   ]
  
  // const participantAuras = participants.map((ring) => {
  //   return <Aura essence={ring}/>
  // })
  
  let loading = 'waiting'
  let count = 0
  // const participants = []
  
  useEffect(() => {
    
    
  const interval = setInterval(() => {
    
    if(count < 3){
      count == 0 && participants.push(<Aura /* here */ WIDTH={window.innerWidth/8} HEIGHT={window.innerHeight/8} essence={LAYERS1}/>)
      count == 1 && participants.push(<Aura /* here */ WIDTH={window.innerWidth/8} HEIGHT={window.innerHeight/8} essence={LAYERS2}/>)
      count == 2 && participants.push(<Aura /* here */ WIDTH={window.innerWidth/8} HEIGHT={window.innerHeight/8} essence={LAYERS3}/>)
    }
    
    setParticipants(participants)
    
    let i = 0
    while(i <= count) {
      setDots(dots + "...")
      i++
    
    }
     
    if(count == 3) {
      count = 0
      setDots('breath')
      clearInterval(interval)
    } else {
      count += 1
    }
    
    
  }, 1000)
  
  
  return () => clearInterval(interval);
}, []);
  
  return (
    
      <div className="nav">
        <div>{dots}</div>
        <br />
        <br />
        <Player />
        <br />
        <div  className="spaces" >
          {participants}
        </div>
      </div>
      
    )
}


// var SCREEN_WIDTH = window.innerWidth/4,
// 				SCREEN_HEIGHT = window.innerHeight/4,
				
function Layer(props) {
  return (
      <div>
        <span>
          <Aura WIDTH={window.innerWidth/4} HEIGHT={window.innerHeight/4} essence={[props.essence]}/>
        </span>
        <span>
          Ξ 2
        </span>
        <br />
        <span>
          |===============>--------]
        </span>
        <br />
        <br />
        <button className="but-sub">
          +
        </button>
        <button className="but-sub">
          -
        </button>
      </div>
    )
}

function Subscriptions(props){
    // const participants = [
    //   [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff9900, 1 ], [ 0.75, 0xffaa00, 0.75 ]],
    //   // [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff9900, 1 ], [ 0.75, 0xffaa00, 0.75 ]]
    // ]
    
    const split = props.layers.map((essence) => {
      // console.log(layer)
      return <Layer essence={essence} />
    })
  
  // const layeredAuras = split.map((ring) => {
  //   return <Aura essence={ring}/>
  // })
  
  
  return (
      <div className="spaces" >
        {split}
      </div>
    )
}

let UI_STATE = 1;

const UI_STATES = Object.freeze({
  BEGIN :1,
  INTENT:2,
  NAV   :3,
  ROOM  :4,
  LAYERS:5,
  MAP   :6
})

const SPACE_STATE = Object.freeze({
  FLOW: 1,
  LOCAL: 2,
  GLOBAL: 3
})

const changeState = (NEXT_STATE) => {
  console.log(`changing state: ${NEXT_STATE}`)
  UI_STATE = NEXT_STATE
}

function Start(props){
  const [isGo, setGo] = useState(true);
  
  return(
    <div className="go-wrapper">
      <button className="but"
        style={{cursor: 'pointer'}}
        onMouseEnter={() => setGo(false)}
        onMouseLeave={() => setGo(true)}
        onClick={() => props.setState(UI_STATES.INTENT)}
      > {isGo ? 'go' : 'x'}</button>
    </div>
  )
}

function Nav(props){
  const list = [2,15,60]
  let controls = 0
  // const setDirection
  
  const nav = list.map((count) => {
    return <State count={count} direction={controls++} setState={props.setState}/>
  })
  
  return (
    <div className="nav">
      {"choose :"}
      <div  className="spaces" >
        {nav}
      </div>
    </div>
  )
}


function Main(){
  // {
  
  const [state, setState] = useState(1)
  const [control, setControl] = useState(1)
  
  const view = []
  state < 4 && view.push(<Header />)
  control == 1 && view.push(<Aura /* here */ WIDTH={window.innerWidth/4} HEIGHT={window.innerHeight/4} essence={LAYERS}/>)
  
  switch(control){
    case 1:
      switch(state){
        case 1:
          view.push (    <Start setState={setState}/>        )
          break;
        case 2:
          view.push (    <Intention setState={setState}/>    )
          break;
        case 3:
          view.push (    <Nav setState={setState}/>          )
          break;
        case 4:
          console.log('setting room #2')
          view.push (    <Room setState={setState}/>         )
          break;
      }
      break;
    case 2:
      view.push(<Aura essence={LAYERS}/>)
      view.push(<Subscriptions layers={LAYERS}/>)
      break;
    case 3:
      view.push(<Space />)
      break;
  }
  
  view.push(<Footer setControl={setControl}/>)
  return view
  // })

        // }
}

function App() {
  
  console.log('Booting the console..')
  // const [space, setSpace] = useState(false);
  const [initiate, setinitiate] = useState(false);

  console.log(UI_STATE)
  return (
    <div className="App">
      
      <Main />
    </div>
  );
}

      // <Footer space={space} setSpace={setSpace} />
export default App;
