import React from "react";
import alarm from './assets/alarm.wav';
import './App.css';

const audio = new Audio(alarm);

// play alarm for seconds
function playAlarm(seconds: number) {
    audio.play();
    const runtime = seconds * 1000;
    setTimeout(() => audio.pause(), runtime);
}

function secondsToTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

interface AppState {
    inSettings: boolean;
    worktime: number;
    breaktime: number;
    darkMode: boolean;
    time: number;
    isRunning: boolean;
    isBreak: boolean;
}

export default class App extends React.Component {
    state: AppState = ({
        inSettings: false,
        worktime: 1 * 60,
        breaktime: 5 * 60,
        darkMode: false,
        time: 1 * 60,
        isRunning: false,
        isBreak: false,
    } as AppState);

    private intervalId: NodeJS.Timer | undefined = undefined;

    componentDidMount() {
        this.intervalId = setInterval(() => {
            if (this.state.isRunning) {
                this.setState((prevState: AppState) => ({ time: prevState.time - 1 }));
                // change time on title
                document.title = secondsToTime(this.state.time);
                // if time is 0 play alarm, end the interval and change the state
                if (this.state.time === 0) {
                    playAlarm(1);
                    clearInterval(this.intervalId);
                    this.setState((prevState: AppState) => ({ time: prevState.isBreak ? prevState.breaktime : prevState.worktime }));
                    this.setState({ isRunning: false });
                    this.setState((prevState: AppState) => ({ isBreak: !prevState.isBreak }));
                }
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        document.title = secondsToTime(this.state.time);
        const themePrefix = this.state.darkMode ? 'dark' : 'light';
        if (this.state.inSettings) {
            return (
                <div id={themePrefix + 'Settings'} className='container'>
                    <h1>Settings</h1>
                    <label htmlFor="workTime">Work time</label>
                    <input className='numInput' type="number" name="workTime" value={this.state.worktime / 60} onChange={(e) => this.setState({ worktime: parseInt(e.target.value) * 60 })} />
                    <br />
                    <label htmlFor="breakTime">Break time</label>
                    <input className='numInput' type="number" name="breakTime" value={this.state.breaktime / 60} onChange={(e) => this.setState({ breaktime: parseInt(e.target.value) * 60 })} />
                    <br />
                    <label htmlFor="darkMode">Dark mode</label>
                    <input type="checkbox" name="darkMode" checked={this.state.darkMode} onChange={(e) => this.setState({ darkMode: e.target.checked })} />
                    <br />
                    <button className={themePrefix + 'SaveBtn'} onClick={() => this.setState({ inSettings: false })}>Save</button>
                </div>
            )
        } else {
            const running = this.state.isRunning ? 'Pause' : 'Start';
            return (
                <div id={themePrefix + 'Timer'} className='container'>
                    <h1>{this.state.isBreak ? 'Break' : 'Work'}</h1>
                    <h2>{secondsToTime(this.state.time)}</h2>
                    <button className='timerBtn' id={themePrefix + 'SettingsBtn'} onClick={() => this.setState({ inSettings: true })}>Settings</button>
                    <button className='timerBtn' id={themePrefix + running} onClick={() => this.setState({ isRunning: !this.state.isRunning })}>{running}</button>
                    <button className='timerBtn' id={themePrefix + 'Reset'} onClick={() => {
                        this.setState({ time: this.state.worktime });
                        this.setState({ isRunning: false });
                        this.setState({ isBreak: false });
                    }}>
                        Reset
                    </button>
                </div>
            )
        }
    }
}