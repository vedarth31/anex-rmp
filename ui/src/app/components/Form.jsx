"use client"

import React, { useState } from "react"
import axios from "axios"

export default function Form() {
    const [formData, setFormData] = useState({
        classCode: "",
        classNum: "",
        profName: "",
    });

    const [responseData, setResponseData] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        const response = await axios.post('http://127.0.0.1:5000/api/course_and_prof_info', { dept: formData.classCode, number: formData.classNum, professor: formData.profName });
        // console.log("response: ", response);
        console.log("response: ", response.data);
        setResponseData(JSON.stringify(response.data, null, 2));
    }

    const renderGPA = () => {
        const { Professor } = JSON.parse(responseData);
        const { GPA } = JSON.parse(responseData);

        return (
            <div>
                <b>In recent semesters, {Professor.Name} had average GPAs of:  </b>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {Object.entries(GPA).map(([semester, gpa]) => (
                        <li key={semester}>{`${semester}: ${gpa}`}</li>
                    ))}
                </ul>
            </div>
        );
    }

    const renderGradesPercentage = () => {

        const { GradesPercentage } = JSON.parse(responseData);
        return (
            <div>
                <b>In these semesters, they had an average grade distribution of: </b>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {Object.entries(GradesPercentage).map(([grade, percentage]) => (
                        <li key={grade}>{`${grade}: ${percentage}%`}</li>
                    ))}
                </ul>
            </div>
        );
    }

    const renderProfessorInfo = () => {

        const { Professor } = JSON.parse(responseData);
        return (
            <div>
                <p><b>{`${Professor["Num_Ratings"]} students on RMP have stated that`}:</b></p>
                <p>{`Difficulty: ${Professor["Difficulty"]}/5`}</p>
                <p>{`Rating: ${Professor.Rating}/5`}</p>
                <p>{`${Professor["Would Take Again"]}% would take again.`}</p>
            </div>
        );
    };

    return (
        <div>
            <form className="form-container" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="classCode">4 Letter Class Code: </label>
                    <input type="text" id="classCode" name="classCode" value={formData.classCode} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="classNum">3 Digit Class Number: </label>
                    <input type="text" id="classNum" name="classNum" value={formData.classNum} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="profName">Professor Name:</label>
                    <input type="text" id="profName" name="profName" value={formData.profName} onChange={handleChange} />
                </div>
                <input type="submit" value="Submit" />
            </form>

            <br></br>

            {responseData && (
                <div>
                    {renderGPA()}
                    {renderGradesPercentage()}
                    {renderProfessorInfo()}
                </div>
            )}
        </div>
    );
}