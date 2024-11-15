import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Logo from "../../img/Logo.png";

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState("2023");
  const years = ["2023", "2024"];
  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  
  const handleYear = (event) => {
    setYear(event.target.value);
  };
  const handleMonth = (event) => {
    setMonth(event.target.value);
  };
  const handleSearch = () => {
    axios
      .get("http://localhost:5000/api/report", {
        params: { month: month, year: year },
      })
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setReports(data);
      })
      .catch((error) => console.error("Error fetching reports:", error));
  };

  return (
    <div>
      <select value={year} onChange={handleYear}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select value={month} onChange={handleMonth}>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <button onClick={handleSearch}>Searct</button>
      <h1>Report</h1>
      {reports && (
        <div>
          <h2>Household total</h2>
          <p>
            Ages 0-17: {JSON.stringify(reports.householdTotal.minors, null, 2)}
          </p>
          <p>
            Ages 18-64: {JSON.stringify(reports.householdTotal.adults, null, 2)}
          </p>
          <p>
            Ages 65+: {JSON.stringify(reports.householdTotal.adults, null, 2)}
          </p>
          <p>Total: {JSON.stringify(reports.householdTotal.total, null, 2)}</p>
          <h2>Usage</h2>
          <p>New intakes: {reports.newIntakes}</p>
          <p>
            Total visits: {JSON.stringify(reports.totalVisits.total, null, 2)}
          </p>
          <p>
            Unique visits:{" "}
            {JSON.stringify(reports.totalVisits.uniqueVisit, null, 2)}
          </p>
          <p>Total pounds taken {reports.totalPoundTaken}</p>
        </div>
      )}
    </div>
  );
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
`;
export default Reports;
