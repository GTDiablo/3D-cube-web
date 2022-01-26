import { Node } from "./core/types";
import dummyCube from './dummyCube';
import Cube from "./core/cube";
import CubeSerializer from "./core/serlializers";
//
import NodeController from './components/NodeController';
import EngineWindow from "./components/EngineWindow";
//
import { useState, useEffect, Fragment, memo } from 'react'
import io, {Socket, } from 'socket.io-client';
//
import './App.css'

// const SOCKET_PORT = process.env.REACT_APP_SOCKET_PORT || 8000;
const SOCKET_PORT = 8000;
// const SOCKET_HOST = process.env.REACT_APP_SOCKET_HOST || window.location.hostname
const SOCKET_HOST = window.location.hostname
const SOCKET_URL = `http://${SOCKET_HOST}:${SOCKET_PORT}`;

const App = () => {
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [cube, setCube] = useState<Cube | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

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
          newSocket?.emit('cube-change-web', node);
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

  const loaded = !!socket && !!cube;

  const renderComponents = () => {
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
        </Fragment>
    )
  }

  return (
    <div className="App">
      { renderComponents() }
    </div>
  )
}

export default memo(App);
