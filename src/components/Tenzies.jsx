import { useState, useEffect } from 'react'
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import Die from "./Die"
// import getTime from "./timer"

const Tenzies = () => {

    const [tenzies, setTenzies] = useState(false)
    const [dice, setDice] = useState(allNewDice())
    const [count, setCount] = useState(0)
    const [timer, setTimer] = useState(0)
    const [running, setRunning] = useState(false)
    const [results, setResults] = useState(
            () => JSON.parse(localStorage.getItem("results")) || []
        )
    
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue) 
         const newResult = {
            rollTimes: count,
            time: timer,
            id: nanoid()
         }   
        if (allHeld && allSameValue) {
             setTenzies(true)
             setRunning(false)
             setResults(prevData => [newResult, ...prevData]) 
        }
    }, [dice])
        
    useEffect(() => {
        let interval
        if (running){
                interval= setInterval(() => {
                setTimer(prevData => prevData + 1)
            }, 1000)
         } else if (!running){
              clearInterval(interval)
        }  
        return () => clearInterval(interval)
    }, [running])

    useEffect(() => {
        localStorage.setItem("results", JSON.stringify(results))
    }, [results])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRunning(true)
            setCount(prevData => prevData + 1) 
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setCount(0)
            setTimer(0)
        }
    }
    
    function holdDice(id) {
        setRunning(true)
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    function getTime(timer){
        const getSec = `0${Math.floor(timer % 60)}`.slice(-2)
        const min = Math.floor(timer / 60)
        const getMin = `0${Math.floor(min % 60)}`.slice(-2)
        const getHour = `0${Math.floor(timer / 3600)}`.slice(-2) 
        return `${getHour}:${getMin}:${getSec}`
    }
    
    function handleReset(){
        setResults([])
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

    const play = (
        <div>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="numbers" >
                {/* <p>Rolled: {count} times</p> */}
                <h4 className='timer'>{getTime(timer)}</h4>
            </div>
        </div>
        )
    
    const finish = (
        <div className="finish">
            {results && results.map(result => (
                <div key={result.id} className="results">
                    <ul>
                        <li>
                            <span>Rolls: {result.rollTimes}</span>
                             <span>{getTime(result.time)}</span>
                        </li>
                    </ul>
                </div>
            ))}
        </div>
    )

    return ( 
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            {tenzies ? finish : play}
            
            <div className="btn">
                <button 
                    className="roll-dice" 
                    onClick={rollDice}
                >
                    {tenzies ? "New Game" : "Roll"}
                </button>
                {tenzies && <button className="roll-dice" onClick={handleReset}>Reset</button>}
            </div>
        </main>
     );
}
 
export default Tenzies;