import React from 'react';
import { TreeState } from '../types';

interface OverlayProps {
  treeState: TreeState;
  setTreeState: (state: TreeState) => void;
}

export const Overlay: React.FC<OverlayProps> = ({ treeState, setTreeState }) => {
  const isFormed = treeState === TreeState.FORMED;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      {/* Header */}
      <div className="text-center mt-4">
        <h1 className="text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-[#D42426] to-[#ff6b6b] font-luxury font-bold tracking-widest drop-shadow-md">
          CHRISTMAS MAGIC
        </h1>
        <p className="text-[#E5E4E2] font-luxury mt-2 tracking-widest text-sm md:text-base uppercase opacity-90">
          A Virtual Holiday Experience
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center mb-12 pointer-events-auto">
        <button
          onClick={() => setTreeState(isFormed ? TreeState.CHAOS : TreeState.FORMED)}
          className={`
            relative px-12 py-4 
            border-2 border-[#D42426] 
            text-[#D42426] font-luxury font-bold text-xl uppercase tracking-widest
            transition-all duration-700 ease-out
            hover:bg-[#D42426] hover:text-[#FFFFFF] hover:shadow-[0_0_30px_rgba(212,36,38,0.6)]
            ${isFormed ? 'bg-[#0b1015]/80' : 'bg-transparent'}
          `}
        >
          {isFormed ? "Release Magic" : "Decorate Tree"}
          
          {/* Decorative corners */}
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#D42426]"></span>
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#D42426]"></span>
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#D42426]"></span>
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#D42426]"></span>
        </button>
      </div>
      
      {/* Status */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 hidden md:block">
         <div className="flex flex-col gap-4">
            <div className={`w-1 h-16 transition-all duration-1000 ${isFormed ? 'bg-[#D42426]' : 'bg-[#333]'}`}></div>
            <div className={`w-1 h-16 transition-all duration-1000 ${!isFormed ? 'bg-[#FFFFFF]' : 'bg-[#333]'}`}></div>
         </div>
      </div>
    </div>
  );
};