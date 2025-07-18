
import React, { useEffect, useState } from "react";

const CircularProgressBar = ({ percentage, radius = 25, stroke = 3 }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    let start = 0;
    const duration = 1000; // 1 second
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(progress * percentage);
      setAnimatedPercentage(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  const strokeDashoffset =
    circumference - (animatedPercentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#ffffff"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#25c95f"
        fill="#f5f5f5"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="black"
        fontSize="14"
      >
        {`${animatedPercentage}%`}
      </text>
    </svg>
  );
};

export default CircularProgressBar;