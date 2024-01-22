"use client";

import React, { useState } from "react";
import axios from "axios";
import './Form.css';
import EnhancedTable from './EnhancedTable';
import SingleProf from './SingleProf'
import Loading from "../loading.json"
import Lottie from "lottie-react"
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Info from './Info'

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

  const theme = createTheme({
    palette: {
      primary: {
        main: "#500000",
      }
    },
  });

  return (
    <div className="main">
      <form className="container mt-5" onSubmit={handleSubmit} /*style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}*/>

        <ThemeProvider theme={theme}>
          <TextField
            id="outlined-department"
            label="Department"
            variant="outlined"
            name="classCode"
            value={formData.classCode}
            onChange={handleChange}
          />

          <TextField
            id="outlined-class-number"
            label="Class Number"
            variant="outlined"
            name="classNum"
            value={formData.classNum}
            onChange={handleChange}
          />

          <TextField
            id="outlined-professor"
            label="Professor (optional)"
            variant="outlined"
            name="profName"
            value={formData.profName}
            onChange={handleChange}
          />
        {/* </ThemeProvider> */}

        <div className="button-container">
          {/* <ThemeProvider theme={theme}> */}
            <Button className="button-submit" type="submit" variant="contained" size="large">Submit</Button>
          {/* </ThemeProvider> */}
        </div>
        </ThemeProvider>
      </form>

      {loadingState && formSubmitted &&
        <div className="loading-animate">
          <Lottie animationData={Loading} />
        </div>}

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

      {!formSubmitted && (
        <div>
          <Info />
        </div>
      )}

    </div>
  );
}
