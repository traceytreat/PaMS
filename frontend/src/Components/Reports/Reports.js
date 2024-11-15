import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Logo from '../../img/Logo.png'

const Reports = () => {
    const [reports, setReports] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('http://localhost:5000/api/report')
            .then((response) => {
                return response.data
            }).then((data) => {
                setReports(data);
                setLoading(false);
            }
            )
            .catch(error => console.error('Error fetching reports:', error));
    }, []);
    if(isLoading){
        return(
            <div>Loading...</div>
        )
    }
    return (
        <div>
            <h1>Reports</h1>
            <h2>Household total</h2>
            <ul>
                {reports.householdTotal.map((item, index) => (
                    <li key={index}> {item.year}-{item.month}<br></br>
                         Minors: {item.minors}<br></br>
                         Adults: {item.adults}<br></br>
                         Seniors: {item.seniors}<br></br>
                         Total: {item.householdTotal}<br></br>
                    </li>
                ))}
                {reports.totalVisits.map((item,index) => (
                    <li key={index}> {item.month}<br></br>
                        Total Visits: {item.visitcount}<br></br>
                        Unique Members: {item.uniqueVisits}
                    </li>
                ))}
            </ul>
        </div>

    )
};

const ReportsStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;

    header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2rem;
        gap: 1rem;
    }

    .logo {
        width: 80px;
        height: auto;
    }

    .title {
        font-size: 2rem;
        font-weight: bold;
        color: #222260;
    }
`
export default Reports