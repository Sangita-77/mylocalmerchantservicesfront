import React from "react";

const CircularProgressBar = ({ percentage, radius = 25, stroke = 3 }) => {
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
        {`${percentage}%`}
      </text>
    </svg>
  );
};

export default CircularProgressBar;
