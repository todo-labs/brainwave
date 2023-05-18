import { quizRouter } from "src/server/api/routers/quiz";
import React from 'react';

import styles from "src/styles/quiz-form.module.css";



export const quizForm = () => {

    return (
        <>

        <div  className={styles.container}>

        <h1>Generate Quiz</h1>
            <form className ={styles.formContainer}>
                <label> Quiz Title </label>
                <input type="text" name="examTitle" placeholder="Quiz Tiltle" />

                <label> Quiz Topic </label>
                    <select name="examTitle" placeholder="Quiz Topic">
                       <option id= {styles.placeholder} value=" ">Select a topic </option>
                        <option value="ALGEBRA">ALGEBRA</option>
                        <option value="GEOMETRY">GEOMETRY</option>
                        <option value="TRIGONOMETRY">TRIGONOMETRY</option>
                        <option value="STATISTICS">STATISTICS</option>
                        <option value="CALCULUS">CALCULUS</option>
                        <option value=" ANCIENT">ANCIENT</option>
                        <option value="EUROPEAN">EUROPEAN</option>
                        <option value="AMERICAN">AMERICAN</option>
                        <option value="ASIAN">ASIAN</option>
                        <option value="AFRICAN">AFRICAN</option>
                        <option value="CHEMISTRY">CHEMISTRY</option>
                        <option value="BIOLOGY">BIOLOGY</option>
                        <option value="PHYSICS">PHYSICS</option>
                    </select>

                <label> Quiz Description </label>
                <input type="text" name="examDescription" placeholder="Quiz Description" />

                <label> Quiz Difficulty </label>
                <input type="radio" name="examDifficulty"  value="easy"/>Easy
                <input type="radio" name="examDifficulty"  value="medium"/>Meduim
                <input type="radio" name="examDifficulty"  value="hard"/>Hard

                <label> Quiz University </label>
                <input type="text" name="quiz University"  placeholder="Quiz University"/>

                <button type="submit">Generate</button>

            </form>
        </div>
        </>    

  
    )
}