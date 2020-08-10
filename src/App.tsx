import React, {useState, useEffect} from 'react'
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap'
// @ts-ignore
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {ThreadID} from '@textile/hub'
import logo from './logo.svg'
import './App.css'
import { ChatInstance, ChatState } from './types'
import { ChatContext } from './ChatContext'
import { getUsername } from './helpers'

import { AudioService } from './AudioService';


import Player from './components/Player'
import Space from './components/Space'
import Aura from './components/Aura'

import less from './imgs/less_1.png'
import more from './imgs/more_1.png'
import line from './imgs/line.png'


var audioService: any;


function launchSpace(){
  console.log('howdie')
}

let key = 0;
let i = ["⤶", "⤈" ,"⤷"]
let LAYERS = [[ 0.25, 0xff7700, 1 ], [ 0.5, 0xff1100, 1 ], [ 0.6, 0xffaa00, 0.75 ]]
let LAYERS1 = [[ 0.25, 0xff7900, 1 ], [ 0.5, 0xfa1100, 1 ], [ 0.6, 0xffa900, 0.75 ]]
let LAYERS2 = [[ 0.25, 0xff7200, 1 ], [ 0.6, 0x20B2AA, 0.75 ]]
let LAYERS3 = [[ 0.5, 0x7CFC00, 1 ], [ 0.6, 0xffaa00, 0.75 ]]

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

const changeState = (NEXT_STATE: any) => {
  console.log(`changing state: ${NEXT_STATE}`)
  UI_STATE = NEXT_STATE
}

function Start(props: any){
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

function Nav(props: any){
  const list = [2,15,60]
  let controls = 0
  // const setDirection
  
  const nav = list.map((count) => {
    return <State count={count} direction={controls++} setState={props.setState}/>
  })
  
  return (
    <div  className="nav">
      <div style={{ width: '100%'} as React.CSSProperties}>{"choose :"} </div>
      <div  className="spaces" >
        {nav}
      </div>
    </div>
  )
}


function State (props: any) {

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

function Header(props: any){
  return(
    <div className='header'>
      wiflo°
      <div style={{color: 'grey', paddingTop: '10px'}}>
        about us
      </div>
    </div>
    )
}

function Footer(props: any){
  
  const globalToggle = React.useCallback(() => {
    props.setControl(SPACE_STATE.GLOBAL)
    props.setState(UI_STATES.BEGIN)
    key = 0
  },[]);
  
  const flowToggle = React.useCallback(() => {
    props.setControl(SPACE_STATE.FLOW)
    key = 0
  },[]);
  
  const selfToggle = React.useCallback(() => {
    props.setControl(SPACE_STATE.LOCAL)
    key = 0
  },[]);
  
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

function Intention(props: any){
  const [isGo, setGo] = useState(true);
   
  return(
      <div className='intent'>
        <input style={{textAlign: 'center'} as React.CSSProperties} type="text" name="intention=v1" placeholder="set intention" className="intention"/>
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
  const [participants, setParticipants] = useState([] as  any);
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
        <div style={{alignText: 'center', width: '100%'} as React.CSSProperties} >{dots}</div>
        <br />
        <br />

        <Player />
        <br />
        <br />
        <br />
        <div  className="spaces" >
          {participants}
        </div>
      </div>
      
    )
}
    
function Layer(props: any) {
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
          {"|===============>--------]"}
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

function Subscriptions(props: any){
    
    const split = props.layers.map((essence: any) => {
      // console.log(layer)
      return <Layer essence={essence} />
    })
  
    return (
      <div className="spaces" >
        {split}
      </div>
    )
}

function record(){

}

function broadcast(){
   audioService = new AudioService();
   audioService.init()
}

function dial(){

  if (window !== null) {
    // continue - error suppressed when used in this way.
    // console.log(window.document!.getElementById('invite')!.value!)
    let inviteCode = (document.getElementById('invite') as HTMLInputElement).value;
    console.log(inviteCode)
    
    audioService.audioBridge.thread.joinExternalRoom(inviteCode).then((threadId:any ) => {
      console.log('threadId')
      console.log(threadId)
      // this.setRoom.bind(this)
    
    })

    audioService.audioBridge.thread.onMessage().subscribe((threadEvent:any) => {
      const m = threadEvent.event.patch;
      console.log('------------------')
      console.log(m)

      // messages.push(m);
      // this.setState({ messages: messages });
    });
  }
}

function Controller (props: any) {



  return (
      <>  
          <div className="controller">
          <input className="invite" id="invite" placeholder="invite"></input>
          <button className="controls" onClick={broadcast}>broadcast</button>
          <button className="controls" onClick={dial}>dial</button>
          <button className="controls" onClick={record}>■</button>
          </div>
      </>
    )
}

function Main(){
  
  const [state, setState] = useState(1)
  const [control, setControl] = useState(1)
  
  const view = [] as  any;
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
          view.push (    <Room {...setState}/>         )
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
  
  if (state < 4){
    view.push(<Footer setControl={setControl} setState={setState}/>)

  }else {
    view.push(<Controller />)

  }

  return view
  // })

        // }
}



class App extends React.Component {
  render() {
    return(
        <div className="App">
          <Main />
        </div>
      )
  }
}

// class App extends React.Component {
//   static contextType = ChatContext;
//   private username = React.createRef()
//   private textInput = React.createRef()
//   private messagesEnd = React.createRef()
//   state: ChatState = {
//     /**
//      * We'll use the ChatInstance so they match our thread schema right away.
//      * This first message wont actually be written to the chat.
//      */
//     messages: [
//       {
//         _id: '',
//         text: 'Welcome! Type a message and press Send Message to continue the chat.',
//         author: 'Bot'
//       }
//     ],
//     input: '',
//     username: 'unknown'
//   }

//   setupObservables = () => {
//     const observable = this.context.onMessage();

//     observable.subscribe((threadEvent: any) => {
//       const m: ChatInstance = threadEvent.event.patch;
//       let messages = this.state.messages;

//       messages.push(m);
//       this.setState({ messages: messages });
//     });
//   }
//   componentDidMount () {

//     audioService.init()

//     //initiate thread connection
//     this.context.init().then(() => {
//       this.setupObservables()
//       let room = window.location.hash.replace('#', '');
//       if (room && room !== '') {
//         this.context.rejoinOpenRoom().then((threadID: ThreadID) => {
//           this.setRoom(threadID)
//         })
//       } 
//     })
//     getUsername().then((username) => {
//       this.setState({username})
//     })
//   }

//   componentDidUpdate(prevProps: any, prevState: ChatState) {
//     if (prevState.messages.length < this.state.messages.length) {
//       this.scrollToBottom()
//     }
//   }

//   componentWillUnmount () {
//     this.context.disconnect();
//   }

//   setRoom(threadID: ThreadID) {

//     this.context.getInfoString().then((info: string) => {
//       const b = Buffer.from(info)
//       this.setState({invite: b.toString('hex')})
//       this.setupObservables()
//     })

//     this.setState({
//       threadID,
//     })
//   }
//   createNewRoom () {
//     console.log('test')
//     this.context.startNewRoom().then(this.setRoom.bind(this))
//   }
//   joinInvite() {
//     console.log('join invite')
//     // @ts-ignore
//     const info = this.textInput.current.value
//     if (info === '') {
//       throw new Error('Invite required to join')
//     }
//     const json = Buffer.from(info, 'hex').toString()
//     const invite = JSON.parse(json)
//     console.log(invite)
//     // this.context.joinExternalRoom(invite).then(this.setRoom.bind(this))

//     audioService.audioBridge.thread.joinExternalRoom(invite).then((threadId:any ) => {
//       console.log('threadId')
//       console.log(threadId)
//       // this.setRoom.bind(this)
    
//     })

//     audioService.audioBridge.thread.onMessage().subscribe((threadEvent:any) => {
//       const m = threadEvent.event.patch;
//       console.log('------------------')
//       console.log(m)

//       // messages.push(m);
//       // this.setState({ messages: messages });
//     });
//   }
//   scrollToBottom = () => {
//     // @ts-ignore
//     this.messagesEnd.scrollIntoView({ behavior: "smooth" })
//   }
//   renderUsername() {
//     return (
//       <p>
//         username:
//         {/* 
//           // @ts-ignore */}
//         <FormControl defaultValue={this.state.username} ref={this.username}/>
//       </p>
//     )
//   }
//   renderSend() {
//     const handleMessage = (): void => {
//       if (this.state.input !== '') {
//         this.context.send({
//           _id: '',
//           text: this.state.input,
//           // @ts-ignore
//           author: this.username.current.value
//         });
//         this.setState({ input: '' });
//       }
//     }
//     return (
//       <p>
//         <button onClick={() => { handleMessage() }}>
//           Send Message
//         </button>
//       </p>
//     )
//   }
//   renderInput () {
//     const updateInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
//       this.setState({ input: e.target.value });
//     }
//     return (
//       <input
//         className="App-Textarea"
//         placeholder="Type your messsage here..."
//         onChange={updateInput}
//         value={this.state.input}
//       />
//     )
//   }

//   renderChat () {
//     return (
//       <div className="App-chatbox">
//         {this.state.messages.map((msg: ChatInstance, idx: number) => {
//           return (
//             <div key={idx}>
//               <p>{msg.author}</p>
//               <p>
//                 {msg.text}
//               </p>
//             </div>
//           );
//         })}

//         {/* 
//           // @ts-ignore */}
//         <div style={{ float:"left", clear: "both" }} ref={this.messagesEnd}>
//         </div>
//       </div>
//     )
//   }

//   renderModal () {
//     return (
//       <Modal show={this.state.threadID === undefined} animation={false}>
//         <Modal.Header closeButton>
//           <Modal.Title id="contained-modal-title-vcenter">
//             Start Chat
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//         <InputGroup>
//           {/* 
//           // @ts-ignore */}
//           <FormControl as="textarea" ref={this.textInput}/>
//         </InputGroup>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="success" onClick={this.joinInvite.bind(this)}>Join Invite</Button>
//           <Button onClick={this.createNewRoom.bind(this)}>Create New Room</Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   }

//   renderInvite() {
//     return (
//       <p>
//         <CopyToClipboard text={this.state.invite} >
//           <button>Copy invite clipboard</button>
//         </CopyToClipboard>
//       </p>
//     )
//   }

//   render () {

//     return (
//       <div className="App">
//         <img src={logo} className="App-logo" alt="logo" />
//         {this.state.threadID && this.renderUsername()}
//         {this.state.threadID && this.renderChat()}
//         {this.state.threadID && this.renderInput()}
//         {this.state.threadID && this.renderSend()}
//         {this.state.threadID && this.renderInvite()}
//         {!this.state.threadID && this.renderModal()}
//       </div>
//     );
//   }
// }

export default App;
