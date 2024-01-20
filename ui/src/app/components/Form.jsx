"use client";

import React, { useState } from "react";
import axios from "axios";
import './Form.css';
import EnhancedTable from './EnhancedTable';
import SingleProf from './SingleProf'
import Loading from "../loading.json"
import Lottie from "lottie-react"

export default function Form() {
  const initialFormData = {
    classCode: "",
    classNum: "",
    profName: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [responseData, setResponseData] = useState("");
  const [error, setError] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
    setFormSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingState(true);
    setResponseData("");
    setFormSubmitted(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/get_course_info', {
        dept: formData.classCode,
        number: formData.classNum,
        professor: formData.profName,
      });

      if (!response.data || Object.keys(response.data).length === 0) {
        setError("Invalid data entered. Please check your inputs.");
      } else {
        setResponseData(JSON.stringify(response.data, null, 2));
        setError("");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("The requested data has not been found, please try again");
    } finally {
      setLoadingState(false);
    }
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
      </form>

      <br />

      {loadingState && formSubmitted &&
        <p className="loading-animate">
          <Lottie animationData={Loading} />
        </p>}

      {responseData && formData.classCode && formData.classNum && formSubmitted && (
        <div className="results-container">
          {formData.profName === undefined || formData.profName.trim() === '' ? (
            <div className="table">
              <EnhancedTable responseData={responseData} />
            </div>
          ) : (
            <SingleProf data={responseData} />
          )}
        </div>
      )}

      {error && formSubmitted && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
