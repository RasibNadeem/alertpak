import React, { useEffect, useState } from "react";
import Badge from "reactstrap/es/Badge";

function CountdownTimer({date}) {
    const calculateTimeLeft = () => {
        const difference = new Date(date).getTime() - new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                Min: Math.floor((difference / 1000 / 60) % 60),
                Sec: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval, index) => {
        if (!timeLeft[interval]) {
            return;
        }

        timerComponents.push(
            <span key={index}>
        {timeLeft[interval]} {interval}{" "}
      </span>
        );
    });

    return (
        <span>
            {timerComponents.length ? <Badge color='secondary'>{timerComponents} left</Badge>  : <span>{''}</span>}
        </span>
    );
}
export default CountdownTimer;