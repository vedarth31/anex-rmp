"use client"

import React, { useState } from "react";
import axios from "axios";
import './Form.css'
import Loading from "../loading.json"
//import Lottie from "lottie-react"

export default function Form() {
    const initialFormData = {
        classCode: "",
        classNum: "",
        profName: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [responseData, setResponseData] = useState("");
    const [loadingState, setLoadingState] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingState(true);
        setError("");
        setResponseData("");
        let response; 
      
        try {
          if (formData.profName) {
            response = await axios.post('http://127.0.0.1:5000/api/get_course_info', {
              dept: formData.classCode,
              number: formData.classNum,
              professor: formData.profName,
            });
          } else {
            response = await axios.post('http://127.0.0.1:5000/api/get_course_info', {
              dept: formData.classCode,
              number: formData.classNum,
              professor: ""
            });
          }

          console.log('Server Response:', response);
      
          if (!response.data || Object.keys(response.data).length === 0) {
            setError("Invalid data entered. Please check your inputs.");
            setResponseData("");
          } else {
            setResponseData(JSON.stringify(response.data, null, 2));
            setError("");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoadingState(false);
        }
      };
      

    const handleReset = () => {
        setFormData(initialFormData);
        setResponseData("");
        setError("");
    };

    const renderGPA = () => {
      const { Professor } = JSON.parse(responseData);
      const { GPA } = JSON.parse(responseData);

      return (
          <div>
              <b>In recent semesters, {Professor.Name} had average GPAs of:  </b>
              <ul>
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
            <ul>
                {Object.entries(GradesPercentage).map(([grade, percentage]) => (
                    <li key={grade}>{`${grade}: ${percentage}%`}</li>
                ))}
            </ul>
        </div>
    );
};


const renderProfessorInfo = () => {
  const { Professor } = JSON.parse(responseData);

  if (Professor["RMP_data"] == "N/A") {
      return (
          <div>
              <p>Sorry, we were unable to retrieve this professor's RMP data.</p>
          </div>
      )
  }
  return (
      <div>
          <p><b>{`${Professor["Num_Ratings"]} students on Rate my Professor have stated that`}:</b></p>
          <p>{`Difficulty: ${Professor["Difficulty"]}/5`}</p>
          <p>{`Rating: ${Professor.Rating}/5`}</p>
          <p>{`${Professor["Would Take Again"]}% would take again.`}</p>
      </div>
  );
};

const twoProfs = () => {
  return (
    <div>
      {JSON.parse(responseData).map((courseInfo, index) => (
        <div key={index} className="course-info">
          <h2>{courseInfo.Professor.Name}</h2>
  
          <div>
            <h3>GPA:</h3>
            <ul>
              {Object.entries(courseInfo.GPA).map(([semester, gpa]) => (
                <li key={semester}>{`${semester}: ${gpa}`}</li>
              ))}
            </ul>
          </div>
  
          <div>
            <h3>Grades Percentage:</h3>
            <ul>
              {Object.entries(courseInfo.GradesPercentage).map(([grade, percentage]) => (
                <li key={grade}>{`${grade}: ${percentage}%`}</li>
              ))}
            </ul>
          </div>
  
          <div>
            <h3>RMP Info:</h3>
            <p>{`Difficulty: ${courseInfo.Professor.Difficulty}`}</p>
            <p>{`Number of Ratings: ${courseInfo.Professor.Num_Ratings}`}</p>
            <p>{`Rating: ${courseInfo.Professor.Rating}`}</p>
            <p>{`Would Take Again: ${courseInfo.Professor["Would Take Again"]}%`}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

    
    return (
        <div className="main">
            <form className="container mt-4" onSubmit={handleSubmit} >
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
                        onChange={handleChange}
                        placeholder="Optional"
                        />
                        
                </div>

                <span className="buttons">
                    <button type="submit" className="btn btn-primary" >Submit</button>
                    <button type="button" className="btn btn-danger" onClick={handleReset}>Reset</button>
                </span>
            </form>

            <br></br>

            {/* 
                {loadingState &&
                <div className="loading-animate" >
                    <Lottie animationData={Loading} />
                </div>
            }
            */}
            

            {responseData && formData.profName && (
                <div className="results-container" >
                    {renderGPA()}
                    {renderGradesPercentage()}
                    {renderProfessorInfo()}
                </div>
            )}

              {responseData && !formData.profName && (
                <div className="all-results-container">
                  {twoProfs()}
                </div>
              )}

            
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}
