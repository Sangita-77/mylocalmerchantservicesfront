import { useEffect, useState } from "react";

export const Timer = ({ initialMin = 2, initialSec = 20 }) => {
  const [second, setSecond] = useState(initialSec);
  const [minute, setMinute] = useState(initialMin);

  useEffect(() => {
    if (minute === 0 && second === 0) return;

    if (second < 0) {
      setMinute((prev) => prev - 1);
      setSecond(9);
    }

    const secondsTimer = setInterval(() => {
      setSecond((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(secondsTimer);
  }, [second]);

  return (
    <div>
      {`0${minute}`} : {second < 10 ? `0${second}` : second}
    </div>
  );
};
