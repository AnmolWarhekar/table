import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function DataGrid() {
  const [exchangeRates, setExchangeRates] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [holdings, setHoldings] = useState([
    { currency: "EUR", amount: 1000 },
    { currency: "GBP", amount: 500 },
    { currency: "JPY", amount: 5000 },
    { currency: "EUR", amount: 1000 },
    { currency: "EUR", amount: 1000 },
    { currency: "GBP", amount: 500 },
    { currency: "JPY", amount: 5000 },
    { currency: "EUR", amount: 1000 },
    { currency: "GBP", amount: 500 },
    { currency: "JPY", amount: 5000 },
    { currency: "JPY", amount: 200 },
    { currency: "EUR", amount: 1000 },
    { currency: "GBP", amount: 500 },
    { currency: "JPY", amount: 5000 },
    { currency: "EUR", amount: 100 },
    { currency: "GBP", amount: 5000 },
    { currency: "JPY", amount: 250 },
    { currency: "EUR", amount: 100 },
    { currency: "GBP", amount: 550 },
    { currency: "JPY", amount: 5000 },
    { currency: "JPY", amount: 2010 },
    { currency: "EUR", amount: 1040 },
    { currency: "GBP", amount: 5000 },
    { currency: "JPY", amount: 450 },
    { currency: "EUR", amount: 200 },
    { currency: "GBP", amount: 450 },
    { currency: "JPY", amount: 2200 },
    { currency: "JPY", amount: 2010 },
    { currency: "EUR", amount: 104 },
    { currency: "GBP", amount: 5040 },
    { currency: "JPY", amount: 230 },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(holdings.length / 10));
  const [showFilter, setShowFilter] = useState(false);
  const [filterCurrency, setFilterCurrency] = useState('');

  useEffect(() => {
    async function fetchExchangeRates() {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error(error);
      }
    }

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const newTotalValue = holdings.reduce((acc, holding) => {
      return (
        acc +
        holding.amount *
          (exchangeRates[holding.currency]
            ? exchangeRates[holding.currency]
            : 0)
      );
    }, 0);

    setTotalValue(newTotalValue);
  }, [exchangeRates, holdings]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleToggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterChange = (e) => {
    setFilterCurrency(e.target.value);
  };
  
  const filteredHoldings = holdings.filter((holding) => {
  if (!filterCurrency) return true;
  return holding.currency === filterCurrency;
  });
  
  const displayedHoldings = filteredHoldings.slice(
  (currentPage - 1) * 10,
  currentPage * 10
  );
  
  return (
  <div className="DataGrid">
  <header className="DataGrid-header">
  <h2 className="DataGrid-title">Exchange Rates Data Grid</h2>
  <div className="DataGrid-totalValue">
  Total Value: {totalValue.toFixed(2)} USD
  </div>
  </header>
  <div className="DataGrid-filter">
  <button onClick={handleToggleFilter} className="DataGrid-filterButton">
  {showFilter ? "Hide" : "Show"} Filter
  </button>
  {showFilter && (
  <div className="DataGrid-filterForm">
  <label htmlFor="currency">Currency:</label>
  <select
             id="currency"
             value={filterCurrency}
             onChange={handleFilterChange}
           >
  <option value="">All</option>
  <option value="EUR">EUR</option>
  <option value="GBP">GBP</option>
  <option value="JPY">JPY</option>
  </select>
  </div>
  )}
  </div>
  <table className="DataGrid-table">
  <thead>
  <tr>
  <th>Currency</th>
  <th>Amount</th>
  <th>Value (USD)</th>
  </tr>
  </thead>
  <tbody>
  {displayedHoldings.map((holding, index) => (
  <tr key={index}>
  <td>{holding.currency}</td>
  <td>{holding.amount}</td>
  <td>
  {(holding.amount * (exchangeRates[holding.currency] || 0)).toFixed(
  2
  )}
  </td>
  </tr>
  ))}
  </tbody>
  </table>
  <div className="DataGrid-pagination">
  <button
  disabled={currentPage === 1}
  onClick={() => handlePageChange(currentPage - 1)}
  >
  Prev
  </button>
  <span className="DataGrid-pageNumber">
  {currentPage} of {totalPages}
  </span>
  <button
  disabled={currentPage === totalPages}
  onClick={() => handlePageChange(currentPage + 1)}
  >
  Next
  </button>
  </div>
  </div>
  );
  }
  
  export default DataGrid;
