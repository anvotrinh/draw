"use client";
import React, { useState, useRef, useEffect, TouchEventHandler } from "react";

function distance(t1: React.Touch, t2: React.Touch) {
  return Math.sqrt(
    (t2.clientX - t1.clientX) * (t2.clientX - t1.clientX) +
      (t2.clientY - t1.clientY) * (t2.clientY - t1.clientY)
  );
}

const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const drawedLength = useRef(0);
  const lastTouch = useRef<React.Touch | null>(null);

  const handleTouchStart: TouchEventHandler<HTMLCanvasElement> = (e) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const touch = e.touches[0];
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(touch.clientX, touch.clientY);
    lastTouch.current = touch;
  };

  const handleTouchMove: TouchEventHandler<HTMLCanvasElement> = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const touch = e.touches[0];
    context.lineTo(touch.clientX, touch.clientY);
    context.stroke();

    if (lastTouch.current) {
      drawedLength.current += distance(lastTouch.current, touch);
    }
    if (drawedLength.current >= 300) {
      setShowButton(true);
      setIsDrawing(false);
      drawedLength.current = 0;
    }
    lastTouch.current = touch;
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    lastTouch.current = null;
  };

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={windowSize.width}
        height={windowSize.height}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      {showButton && (
        <button
          className="absolute text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={() => setShowButton(false)}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default DrawingCanvas;
