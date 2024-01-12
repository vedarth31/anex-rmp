"use client";

import React, { useState } from "react";
import axios from "axios";
import './Form.css';
import EnhancedTable from './EnhancedTable';

export default function Form() {
  const initialFormData = {
    classCode: "",
    classNum: "",
    profName: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [responseData, setResponseData] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let response;

    try {
      response = await axios.post('http://127.0.0.1:5000/api/get_course_info', {
        dept: formData.classCode,
        number: formData.classNum,
        professor: formData.profName,
      });

      if (!response.data || Object.keys(response.data).length === 0) {
        setError("Invalid data entered. Please check your inputs.");
        setResponseData("");
      } else {
        setResponseData(JSON.stringify(response.data, null, 2));
        setError("");
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("The requested data has not been found, please try again");
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setResponseData("");
    setError("");
  };

  const renderCombinedData = (data) => {
    const { Professor, GPA, GradesPercentage } = JSON.parse(data);
    console.log("renderCombinedData", data);

    return (
      <div>
        <div>
          <b>In recent semesters, {Professor.Name} had average GPAs of: </b>
          <ul>
            {Object.entries(GPA).map(([semester, gpa]) => (
              <li key={semester}>{`${semester}: ${gpa}`}</li>
            ))}
          </ul>
        </div>
        <div>
          <b>In these semesters, students had an average grade distribution of: </b>
          <ul>
            {Object.entries(GradesPercentage).map(([grade, percentage]) => (
              <li key={grade}>{`${grade}: ${percentage}%`}</li>
            ))}
          </ul>
        </div>
        <div>
          {Professor["RMP_data"] === "N/A" ? (
            <p>Sorry, we were unable to retrieve this professor's RMP data.</p>
          ) : (
            <>
              <p><b>{`${Professor["Num_Ratings"]} students on Rate my Professor have stated that`}:</b></p>
              <p>{`Difficulty: ${Professor["Difficulty"]}/5`}</p>
              <p>{`Rating: ${Professor.Rating}/5`}</p>
              <p>{`${Professor["Would Take Again"]}% would take again.`}</p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="main">
      <form className="container mt-5" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div className="form-group">
          <label htmlFor="classCode">4 Letter Class Code:</label>
          <input
            type="text"
            className="form-control"
            id="classCode"
            name="classCode"
            value={formData.classCode}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="classNum">3 Digit Class Number:</label>
          <input
            type="text"
            className="form-control"
            id="classNum"
            name="classNum"
            value={formData.classNum}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="profName">Professor Name:</label>
          <input
            type="text"
            className="form-control"
            id="profName"
            name="profName"
            value={formData.profName}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        <div className="buttons mt-4">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
        <div className="mt-4">
          <button type="button" className="btn btn-danger" onClick={handleReset}>Reset</button>
        </div>
      </form>

      <br />

      {responseData && formData.classCode && formData.classNum && formData.profName && (
        <div className="results-container">
          {renderCombinedData(responseData)}
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {responseData && formData.classCode && formData.classNum && !formData.profName && (
        <EnhancedTable responseData={responseData} />
      )}
    </div>
  );
}
