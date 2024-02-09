import { useEffect, useState } from "react";


interface TimerState {
    time: number;
    isRunning: boolean;
    isWorkTime: boolean;
}

function secondToTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// worktime and breaktime are in seconds
export default function Timer(worktime: number, breaktime: number) {
    const [state, setState] = useState({
        time: worktime,
        isRunning: false,
        isWorkTime: true
    } as TimerState);

    useEffect(() => {
        var interval: number | undefined = undefined;
        if (state.isRunning) {
            interval = window.setInterval(() => {
                setState(prevState => {
                    const time = prevState.time - 1;
                    if (time === 0) {
                        return {
                            time: prevState.isWorkTime ? breaktime : worktime,
                            isRunning: prevState.isRunning,
                            isWorkTime: !prevState.isWorkTime
                        };
                    }
                    return {
                        ...prevState,
                        time
                    };
                });
            }, 1000);
        } else {
            window.clearInterval(interval);
        }
        return () => window.clearInterval(interval);
    }, [state.isRunning, worktime, breaktime]);

    return (
        <div>
            <h1>{state.isWorkTime ? 'Work' : 'Break'}</h1>
            <h2>{secondToTime(state.time)}</h2>
            <button onClick={() => setState(prevState => ({ ...prevState, isRunning: !prevState.isRunning }))}>
                {state.isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={() => setState({ time: worktime, isRunning: false, isWorkTime: true })}>
                Reset
            </button>
        </div>
    )
}