'use client'
import React, { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';

const Earth: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationPhi, setRotationPhi] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lastMouseX = useRef<number | null>(null);

  useEffect(() => {
    let phi = rotationPhi;

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: rotationPhi,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 30000,
      mapBrightness: 6,
      baseColor: [0.282, 0.463, 1], // Màu #4876FF
      markerColor: [0.282, 0.463, 1],
      glowColor: [0.282, 0.463, 1],
      opacity: 1,
      offset: [0, 0],
      markers: [],
      onRender: (state: Record<string, any>) => {
        if (!isDragging) {
          state.phi = phi;
          phi += 0.003; // Quay tự động khi không kéo
        } else {
          state.phi = rotationPhi; // Sử dụng giá trị cập nhật
        }
      },
    });

    return () => {
      globe.destroy();
    };
  }, [rotationPhi, isDragging]);

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định
    setIsDragging(true);
    lastMouseX.current = event.clientX;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && lastMouseX.current !== null) {
      event.preventDefault(); // Ngăn chặn hành vi kéo mặc định
      const deltaX = event.clientX - lastMouseX.current;
      setRotationPhi((prevPhi) => prevPhi + deltaX / 200); // Điều chỉnh tốc độ quay
      lastMouseX.current = event.clientX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastMouseX.current = null;
  };

  return (
    <div
      className="App flex items-start justify-start z-[10]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Đảm bảo dừng khi rời khỏi canvas
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }} // Thay đổi con trỏ
    >
      <canvas
        ref={canvasRef}
        style={{ width: 600, height: 600, maxWidth: '100%', aspectRatio: '1' }}
        onContextMenu={(e) => e.preventDefault()} // Ngăn chặn menu chuột phải
      />
    </div>
  );
};

export default Earth;
