import { useEffect, useState } from 'react';
import './App.scss';
import '@fortawesome/fontawesome-free/css/all.css';
import classNames from 'classnames';

function App() {
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timmerOn, setTimmerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  const timeoutId = setTimeout(() => {
    if (timmerOn && displayTime) {
      setDisplayTime(displayTime - 1);
    }
  }, 1000);

  const handleSessionChange = () => {
    const beep = document.getElementById('beep') as HTMLAudioElement;

    if (!displayTime && !onBreak) {
      setOnBreak(true);
      setDisplayTime(breakTime);
      beep.play();
    }

    if (!displayTime && onBreak) {
      setOnBreak(false);
      setDisplayTime(sessionTime);
      beep.play();
    }
  };

  useEffect(() => {
    handleSessionChange();
  }, [displayTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const changeTime = (value: number, type: string) => {
    if (type === 'break') {
      if ((breakTime <= 60 && value < 0)
        || (breakTime >= 60 * 60 && value > 0)) {
        return;
      }

      setBreakTime((prev) => prev + value);
    } else {
      if ((sessionTime <= 60 && value < 0)
        || (sessionTime >= 60 * 60 && value > 0)) {
        return;
      }

      setSessionTime((prev) => prev + value);

      if (!timmerOn) {
        setDisplayTime(sessionTime + value);
      }
    }
  };

  const handleStart = () => {
    clearTimeout(timeoutId);
    setTimmerOn((prev) => !prev);
  };

  const resetClock = () => {
    const beep = document.getElementById('beep') as HTMLAudioElement;

    clearTimeout(timeoutId);
    setTimmerOn(false);
    setOnBreak(false);
    setDisplayTime(25 * 60);
    setSessionTime(25 * 60);
    setBreakTime(5 * 60);
    beep.pause();
    beep.currentTime = 0;
  };

  return (
    <div className="App">
      <div className="clock">
        <div className="clock__display">
          <div
            className="clock__name"
            id="timer-label"
          >
            {onBreak ? 'Break' : 'Session'}
          </div>

          <div
            className="clock__left"
            id="time-left"
          >
            {formatTime(displayTime)}
          </div>
        </div>

        <div className="clock__time-controls">
          <div className="clock__interval">
            <div
              className="clock__label"
              id="break-label"
            >
              Break
            </div>

            <div className="clock__interval-buttons">
              <button
                className="clock__button"
                type="button"
                id="break-decrement"
                onClick={() => changeTime(-60, 'break')}
              >
                <i className="fa-solid fa-minus" />
              </button>

              <div
                className="clock__length"
                id="break-length"
              >
                {Math.floor(breakTime / 60)}
              </div>

              <button
                className="clock__button"
                type="button"
                id="break-increment"
                onClick={() => changeTime(+60, 'break')}
              >
                <i className="fa-solid fa-plus" />
              </button>
            </div>
          </div>

          <div className="clock__interval">
            <div
              className="clock__label"
              id="session-label"
            >
              Session
            </div>

            <div className="clock__interval-buttons">
              <button
                className="clock__button"
                type="button"
                id="session-decrement"
                onClick={() => changeTime(-60, 'session')}
              >
                <i className="fa-solid fa-minus" />
              </button>

              <div
                className="clock__length"
                id="session-length"
              >
                {Math.floor(sessionTime / 60)}
              </div>

              <button
                className="clock__button"
                type="button"
                id="session-increment"
                onClick={() => changeTime(+60, 'session')}
              >
                <i className="fa-solid fa-plus" />
              </button>
            </div>
          </div>
        </div>

        <div className="clock__start-controls">
          <button
            className="clock__button"
            type="button"
            id="start_stop"
            onClick={handleStart}
          >
            <i className={classNames(
              'fa-solid',
              { 'fa-play': !timmerOn, 'fa-pause': timmerOn },
            )}
            />
          </button>

          <button
            className="clock__button"
            type="button"
            id="reset"
            onClick={resetClock}
          >
            <i className="fa-solid fa-rotate-right" />
          </button>
        </div>

        <audio
          id="beep"
          className="clock__audio"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    </div>
  );
}

export default App;
