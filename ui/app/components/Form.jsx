import React from "react";
import "./Form.css"; 

const Form = () => {
  return (
    <form className="form-container">
      <label htmlFor="classCode">4 Letter Class Code: </label>
      <input type="text" id="classCode" name="classCode" />

      <label htmlFor="classNum">3 Digit Class Number: </label>
      <input type="text" id="classNum" name="classNum" />

      <label htmlFor="profName">Professor Name:</label>
      <input type="text" id="profName" name="profName" />

      <input type="submit" value="Submit" />
    </form>
  );
};

export default Form;
