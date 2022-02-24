import { Node } from "./core/types";
import dummyCube from './dummyCube';
import Cube from "./core/cube";
import CubeSerializer from "./core/serlializers";
//
import NodeController from './components/NodeController';
import EngineWindow from "./components/EngineWindow";
import UserSurvey from "./components/UserSurvey";
import Watermark from "./components/Watermark";
import Changes from "./components/Changes";
import UsedColors from "./components/UsedColors";
//
import { useState, useEffect, Fragment, memo } from 'react'
import io, {Socket, } from 'socket.io-client';
import {v4 as uuidV4 } from 'uuid'
//
import './App.css'

// const SOCKET_PORT = process.env.REACT_APP_SOCKET_PORT || 8000;
const SOCKET_PORT = 8000;
// const SOCKET_HOST = process.env.REACT_APP_SOCKET_HOST || window.location.hostname
const SOCKET_HOST = window.location.hostname
const SOCKET_URL = `http://${SOCKET_HOST}:${SOCKET_PORT}`;

const App = () => {
  const [userIdentifier] = useState<string>(uuidV4);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [cube, setCube] = useState<Cube | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showSurvey, setShowSurvey] = useState<boolean>(true);
  const [changes, setChanges] = useState<Node[]>([]);
  const [usedColors, setUsedColors] = useState<string[]>([]);

  const sendChanges = () => {
    socket?.emit('cube-change-web', { userIdentifier, changes });
    setUsedColors(prevState => {
      const newColors: string[] = changes.map((node: Node)=> node.color).filter((color: string)=> ![...prevState, '#ffffff', '#000000'].includes(color));
      return [...prevState, ...newColors];
    });
    setChanges([]);
  }

  // TODO: Make Node a class
  const areNodesEqual = (n1: Node, n2: Node) => {
    return n1.point.x === n2.point.x && n1.point.y === n2.point.y && n1.point.z === n2.point.z;
  }

  // TODO: add front and back indicator in engine
  // TODO: Optimize in model
  const setCurrentNodeColor = (node: Node, color: string): void => {
    cube?.setNode(node.point, color);
  }

  useEffect(()=> {
    // Connect to server
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket?.on('connect', ()=> {
      // Set cube
      setCube(()=> {
        const cubeNodes = dummyCube.nodes;
        const cubeSize = Math.cbrt(cubeNodes.length);

        if(!Number.isInteger(cubeSize)){
          throw new Error('Nodes number is wrong!');
        }

        const rawData: string = JSON.stringify(cubeNodes);

        const cubeSerializer = new CubeSerializer();
        const cube: Cube = cubeSerializer.deserialize(cubeSize, rawData);

        cube.onChange((node: Node, cube: Cube)=> {
          // newSocket?.emit('cube-change-web', node);
          setChanges(prevState => {
            const newState = prevState.filter((n: Node) => !areNodesEqual(n, node));
            return [node, ...newState];
          });
        });

        return cube;
      });
    })

    newSocket?.on('cube-change-server', (node)=> {
      console.log('Node change from server:', node);
    });

    return ()=> {
      newSocket.close();
    }

  }, []);

  const onUsedColorClicked = (color: string) => {
    if(currentNode){
      cube?.setNode(currentNode.point, color);
    }
  }


  const loaded = !!socket && !!cube;

  const renderComponents = () => {
    if(showSurvey){
      return <UserSurvey userIdentifier={userIdentifier} setShowSurvey={setShowSurvey}/>
    }

    if(!loaded){
      return ( <h1 className="loading-modal">Loading...</h1> )
    }

    return (
        <Fragment>
          <EngineWindow
              cube={cube}
              setCurrentNode={setCurrentNode}
          />
          { !!currentNode && <NodeController node={currentNode} setCurrentNodeColor={setCurrentNodeColor} />}
          { changes.length > 0 && <Changes changes={changes} sendChanges={sendChanges}/>}
          <UsedColors colors={usedColors} onColorClicked={onUsedColorClicked}/>
        </Fragment>
    )
  }

  return (
    <div className="App">
      { renderComponents() }
      <Watermark />
    </div>
  )
}

export default memo(App);
