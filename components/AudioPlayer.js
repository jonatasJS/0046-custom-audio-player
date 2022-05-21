import React, { useState, useRef, useEffect } from 'react'
import styles from "../styles/AudioPlayer.module.css";
// import { BsArrowLeftShort } from "react-icons/bs"
// import { BsArrowRightShort } from "react-icons/bs"
import { FaPlay } from "react-icons/fa"
import { FaPause } from "react-icons/fa"

const AudioPlayer = () => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [animated1, setAnimated1] = useState('');
  const [animated2, setAnimated2] = useState('');

  // references
  const audioPlayer = useRef();   // reference our audio component
  const progressBar = useRef();   // reference our progress bar
  const animationRef = useRef();  // reference the animation

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;

  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState, audioPlayer?.current?.value]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  }

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying)
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  }

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    if (audioPlayer.current.currentTime == audioPlayer.current.duration) {
      setIsPlaying(false);
      setCurrentTime(0);
      progressBar.current.value = 0;
      console.log(currentTime);
      cancelAnimationFrame(whilePlaying)
      return;
    }
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  }

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  }

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / duration * 100}%`)
    setCurrentTime(progressBar.current.value);
  }

  const backThirty = (e) => {
    progressBar.current.value = Number(progressBar.current.value - 30);
    changeRange();
    setAnimated1(e);
    setTimeout(() => setAnimated1(''), 1300);
  }

  const forwardThirty = (e) => {
    progressBar.current.value = Number(progressBar.current.value + 30);
    changeRange();
    setAnimated2(e);
    setTimeout(() => setAnimated2(''), 1300);
  }

  return (
    <div style={{ flexDirection: `column`, gap: '10px' }} className={styles.audioPlayer}>
      <audio ref={audioPlayer} src="https://cdn.simplecast.com/audio/20d50f4f-c498-41b9-b320-bde92a33959b/episodes/88731b98-00b3-4ac6-9175-5b2c8370bc7c/audio/ebb00455-145d-4b21-a974-ae291662cbdd/default_tc.mp3" preload="metadata"></audio>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
        <button
          className={`${styles.forwardBackward} ${animated1}`}
          onClick={() => {
            backThirty('rotate-center-1')
          }}>
          {/* <BsArrowLeftShort /> 30 */}
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAENElEQVRoge3ZXYiUVRgH8J/rari7pqYjqJQRfUC1RaQJBVERXXQRJCJBV2JYVARCFGFFhNpNRaVS0W1CYhfVRXWTBAVBHwQF5Rok1tqXZKyurla6XZwZ9syZM7PvzLy7Qe0fDvO+zzzv/zzPO+c8H2eYwQz+35hVQOep6piMZxA34UasxFIswRyM4ifsxxfYh89wtiOr28S45g5UsAXDVb12xo/YjhVTaDvRhLETC7ADYx0Yno5T2IXzptqBmhN34nAJhqfjCNZPtQOtxij24iFch/PRJ+yBClbjHuzGSAueneidTge+xwPCsiqKedggbOoc5ztVnVLQzPC/hSXVzUS92IyTGf63lfRLtHr7k4XXolglH8l2lEE+2RIqy4nlQo5I+dd1S1xkA5flRAVDCfevWFQS/7TgSpxQ78RL/6pFHWCLegfGhCU2ZagIdU8RnINl6G+h06cxWW7rxsAc+rFVKNJqkxzH+0IiS7ESbwqlwzjO4GNc34R/k3oHDqGnLOPn4CPNN/VpoTKtYalQvOV0x3BDZo4+HEt0V5flwN0R6V94GhvxbST/JNJ/JZJ/g3vxXiT7ssk8byQOPFqWA2vxanXcH8lvVf8rEHqFo5H85qp8vvpq9vLMPOky2luWA81wRzTZD1XZBYkRcdn8dSS/K8O3Jnn2q1ShjFrjGmFtDgiVaA3PVD8XJvrHouuR6DrXDxxM7pelCmU4cLsQjWo4iwfxcoE5xqPrOZnvR5L7+alCLiydVv+zzW1hQA49eARXt/lcR8g5MJrcnzsJxzZhoy7Gc1XZhcKGmy1EqRizmlynejT2GMdThZwDPyf3F2V0cjiKJ00si0twKf5oYVS8P37PcKZzp7ZlHRhK7q/K6HxgYok9G8mXqH+rs4U6/7dIVktGC3BxJM/lgnTu1LYsHlO/B3ZndOJi60+h8XhYfSIbrjoAz0fyg8Ie+TCSfdrElj2JLYUSWRp7RzS2jQP4PNGLxyncFukvxIEmuqPyJUK/sOZj3VVFHOjRWLdsyOjNw+PCWz9T1TuC13FFRn8pXjORlU/hXc2j1X2JDW0Vc9uTh/drHc97tdfcD0zyfb/6Kndcfa6ZFCtMlL21sbkdgi7xRDJ3Rw3NroTkpIJrsEsMajxmebETosXCmo6Jhk1ta1fBd8mcXTX16xOyceHoo2j72A4q8scqa7sl3pkhHRJOD8rCoMY3P44XyiDvFc4qU/ITQkLr64K7XwjFuaPFt0wkwq4xTzirzCWiw0KL2I4jfUKcT0NlbHxph7s19AolQ7Pse0zoYTcJ2bwilOJzhSS2RnB0j8YMm0ac0t58DuuEyNDMgE7HL0rYsEWxSDjuS5NdJ2NMeOtp6zktWC40NIcKGpvWNltl+tx2UORv1iLowbW4RcjWlwnlSK3mGRWS4AGhit0nxPxp+Zt1BjP4L+MfucgPWqpgL1AAAAAASUVORK5CYII=" />
        </button>
        <button onClick={togglePlayPause} className={styles.playPause}>
          {isPlaying ? <FaPause /> : <FaPlay className={styles.play} />}
        </button>
        <button
          className={`${styles.forwardBackward} ${animated2}`}
          onClick={() => {
            forwardThirty('rotate-center-2')
          }}>
          {/* 30 <BsArrowRightShort /> */}
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEOElEQVRoge2ZXYhVVRTHf053HGbu+DE6M5BjIaEEpYb4CfWQEQQ9BEok4UOK0ESEIkQipgiOzpNSWlk+GxQhfRH2VFGEIEWB4lcPw+SkNaODTjOOH+n1Ye3L7LvOOveejz324Pxhc+9dd521/mufvdda+xyYwATub0wKZKcOWAY8AywGHgVmAc3ALeAS0A/0Aj8C3wMngVINuzvdGDfMBrqB845MmtEHbAPaYmzvpHaAmTET+AC4kYG4HqPAfmCqQX5cAlgDDAQgbt2RVYp80AAKyKzHEbgCHAY2AEuRpVEPNAEPAcuBjcBnwHCKwIKgEfg6xsEpYJ3TSYppwBtATxXiwQIoxJAfATa5/7OiEVky/xn2gwVw0DB6HkmXIaDXfNAA1hgGfwUezGvYoRb5XAHMQIqPb+wC0JHHqIck5HMFoDPOCOGWzbhjNnCdygA2/a+MUqKbaKqslm1akeqcBA3IHirmIVgNdUR7m1cMvSLQBfzl6Q0B3yKNncYc4Ahjd/Y28DPwZFj6sIJK8leIFql64CfiN94N4GlPvx1pFSzd68BTIQPYqhwcNnTWev/fAnYhLcRpT37M0/+QyuXYCRz1ZL+HDOCICmCDobMa+MiN1z35s1TeBZAzx6AnX+nkU5BOtCx/LFQA5YNGeSxNce0L3nV/OtnDyt4MT/+EJ385C1krs+gq21PDxiIkyGak2yyj231OV/pD3ver3veWGn5MWAE0V3Fo4XkkG5VxB+k0D1bxUYZfaetr+DFRl+WiBDbfAp4IYKuBaMaKONMYVr+nGjo+diMbtRXY62RzkIPLA0iW8jEp5rvWAzk3+PhXK1gBXFS/HzF0LFwGdjC2LOa5MViFlL8/Lhs2tW/NzQzgrPq90ND53BEbRO5AGa1Uzmo9Uqn7PVk5q00D5nry3ww/2rfmZkIXso8NnW3e/zeBA8CbVBayPmQJAezz5D3IHvnBkx2P4fKp4rIlSQDL1UVXibYSU4BflJ7ebM95+tOBczG6w9i1poiseV93SZIArGZuvaHXCLyNzPptpzeAtB6PG/rtwCFkrZeQKvwN8dnqNcWhlxRZc4+6+AzV83mBdE8larXSReT053PoqnqFQgfRA83mNAZyYrvyPYo8a02F95WRayRcgzmxwPnyfb+bxdBMoo8Q+8gwEynQBvyhfP5Dxj4J4CVlrIQ8VmnNy9RAm7Ot/a3Oa/g9w+hZYH5ewx4WEJ35EvBOCOMF4CvD+AhS0Jpy2C4iqViv+RLwBWOFMDcagS8NJyWkVegkXSBNSJ7XqdInnyYtJ0IBaRniqu8Q8AnwKlLN24DJbrQ7WSfSHugKqzNOsJm38CKSGeIIZB1/E2DDJkUL8lpIF7ssYxSZdX30vCeYhbTTvQnJ6t6mi5xPukO+Zl2MvGZdgrxm7WDsfD2MFMFzSBf7HZLz7wTyP4EJ3Le4CxK+ECjv6AXKAAAAAElFTkSuQmCC" />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
        {/* current time */}
        <div className={styles.currentTime}>{calculateTime(currentTime)}</div>

        {/* progress bar */}
        <div>
          <input style={{ cursor: 'pointer' }} type="range" className={styles.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange} />
        </div>

        {/* duration */}
        <div className={styles.duration}>{(duration && !isNaN(duration)) && calculateTime(duration)}</div>
      </div>

    </div>
  )
}

export { AudioPlayer }
