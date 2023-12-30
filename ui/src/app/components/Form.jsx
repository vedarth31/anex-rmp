"use client"

import React, { useState } from "react";
import axios from "axios";

export default function Form() {
    const initialFormData = {
        classCode: "",
        classNum: "",
        profName: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [responseData, setResponseData] = useState("");
    const [loadingState, setLoadingState] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingState(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/course_and_prof_info', {
                dept: formData.classCode,
                number: formData.classNum,
                professor: formData.profName
            });
            setResponseData(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoadingState(false);
        }
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setResponseData("");
    };

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
    };

    const renderGradesPercentage = () => {
        const { GradesPercentage } = JSON.parse(responseData);
        return (
            <div>
                <b>In these semesters, students had an average grade distribution of: </b>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {Object.entries(GradesPercentage).map(([grade, percentage]) => (
                        <li key={grade}>{`${grade}: ${percentage}%`}</li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderProfessorInfo = () => {
        const { Professor } = JSON.parse(responseData);
        return (
            <div>
                <p><b>{`${Professor["Num_Ratings"]} students on Rate my Professor have stated that`}:</b></p>
                <p>{`Difficulty: ${Professor["Difficulty"]}/5`}</p>
                <p>{`Rating: ${Professor.Rating}/5`}</p>
                <p>{`${Professor["Would Take Again"]}% would take again.`}</p>
            </div>
        );
    };

    return (
        <div>
            <form className="container mt-4" onSubmit={handleSubmit} style={{maxWidth: "400px", marginLeft: "84px"}}>
                <div className="form-group">
                    <label htmlFor="classCode">4 Letter Class Code:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="classCode"
                        name="classCode"
                        value={formData.classCode}
                        onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="classNum">3 Digit Class Number:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="classNum"
                        name="classNum"
                        value={formData.classNum}
                        onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="profName">Professor Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="profName"
                        name="profName"
                        value={formData.profName}
                        onChange={handleChange} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: "24px" }}>Submit</button>
                <button type="button" className="btn btn-danger" style={{ marginTop: "24px", marginLeft: "24px" }} onClick={handleReset}>Reset</button>
            </form>

            <br></br>

            {loadingState &&
                <p style={{ marginLeft: "100px" }}>Loading...</p>
            }

            {responseData && (
                <div style={{ marginLeft: "100px", marginBottom: "64px" }}>
                    {renderGPA()}
                    {renderGradesPercentage()}
                    {renderProfessorInfo()}
                </div>
            )}
        </div>
    );
}
