import React from 'react'

const SingleProf = ({ data }) => {

    const { Professor, GPA, GradesPercentage } = JSON.parse(data);
    if (!Professor || !GPA || !GradesPercentage) {
        return;
    }

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


export default SingleProf
