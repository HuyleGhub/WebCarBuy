'use client'
import React, { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';


const Earth2: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 30000,
      mapBrightness: 6,
      baseColor: [0, 1, 0],
      markerColor: [1, 1, 0], // Customize marker color here
      glowColor: [0, 1, 0.5],
      opacity:1,
      offset: [-300,0],
      markers: [
        // longitude latitude
      ],
      onRender: (state: Record<string, any>) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.\
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="App flex items-start justify-start z-[10]">
      <canvas
        ref={canvasRef}
        style={{ width: 900, height: 600, maxWidth: '100%', aspectRatio: '1'}}
      />
    </div>
  );
};

export default Earth2