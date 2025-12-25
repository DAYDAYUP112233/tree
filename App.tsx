import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { TreeState } from './types';

function App() {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.CHAOS);

  return (
    <>
      <div className="relative w-full h-screen bg-[#0b1015]">
        <Canvas
          shadows
          dpr={[1, 2]} // Quality scaling
          gl={{ 
            antialias: false, // Postprocessing handles AA better typically or adds blur
            stencil: false,
            powerPreference: "high-performance"
          }} 
        >
          <Suspense fallback={null}>
            <Experience treeState={treeState} />
          </Suspense>
        </Canvas>
        
        <Overlay treeState={treeState} setTreeState={setTreeState} />
        
        <Loader 
          containerStyles={{ background: '#0b1015' }}
          innerStyles={{ background: '#0b1015', border: '1px solid #D42426', width: '200px' }}
          barStyles={{ background: '#D42426', height: '5px' }}
          dataStyles={{ color: '#D42426', fontFamily: 'serif' }}
          dataInterpolation={(p) => `Loading Holiday Magic ${p.toFixed(0)}%`}
        />
      </div>
    </>
  );
}

export default App;