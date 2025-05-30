import React, { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js
import './css/userincome.css'; // Direct import of the CSS file

const incomeSources = [
    { id: 'salary', label: 'Monthly Salary ($)', icon: '💼', defaultValue: 5000 },
    { id: 'dividends', label: 'Dividend Income ($)', icon: '📈', defaultValue: 800 },
    { id: 'rental', label: 'Rental Income ($)', icon: '🏠', defaultValue: 1200 },
    { id: 'bank_interest', label: 'Bank Interest ($)', icon: '🏦', defaultValue: 150 },
    { id: 'freelance', label: 'Freelance Work ($)', icon: '💻', defaultValue: 600 },
    { id: 'business', label: 'Business Income ($)', icon: '🚀', defaultValue: 900 },
    { id: 'royalties', label: 'Royalties ($)', icon: '🎵', defaultValue: 200 },
    { id: 'other', label: 'Other Income ($)', icon: '💡', defaultValue: 300 },
];

// Helper for initial state from default values
const initialIncomeValues = incomeSources.reduce((acc, source) => {
    acc[source.id] = source.defaultValue;
    return acc;
}, {});

function UserIncome() {
    const [incomeValues, setIncomeValues] = useState(initialIncomeValues);
    const [summaryData, setSummaryData] = useState([]);

    const pieChartRef = useRef(null); // Ref to hold the Chart.js instance for pie chart
    const barChartRef = useRef(null); // Ref to hold the Chart.js instance for bar chart
    const pieCanvasRef = useRef(null); // Ref to target the pie chart canvas element
    const barCanvasRef = useRef(null); // Ref to target the bar chart canvas element

    // Helper to get current values in the order of labels
    const getCurrentValuesArray = useCallback(() => {
        return incomeSources.map(source => incomeValues[source.id] || 0);
    }, [incomeValues]);

    const incomeDataConfig = {
        labels: incomeSources.map(source => source.label.split(' ($)')[0]), // Remove ' ($)'
        colors: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        icons: incomeSources.map(source => source.icon)
    };

    const createPieChart = useCallback(() => {
        const ctx = pieCanvasRef.current.getContext('2d');

        if (pieChartRef.current) {
            pieChartRef.current.destroy(); // Destroy existing chart before creating new one
        }

        const values = getCurrentValuesArray();

        pieChartRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: incomeDataConfig.labels,
                datasets: [{
                    data: values,
                    backgroundColor: incomeDataConfig.colors,
                    borderWidth: 3,
                    borderColor: '#fff',
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        });
    }, [getCurrentValuesArray]); // Dependency on getCurrentValuesArray

    const createBarChart = useCallback(() => {
        const ctx = barCanvasRef.current.getContext('2d');

        if (barChartRef.current) {
            barChartRef.current.destroy(); // Destroy existing chart before creating new one
        }

        const values = getCurrentValuesArray();

        barChartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: incomeDataConfig.labels,
                datasets: [{
                    label: 'Monthly Income ($)',
                    data: values,
                    backgroundColor: incomeDataConfig.colors.map(color => color + '80'),
                    borderColor: incomeDataConfig.colors,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: $${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }, [getCurrentValuesArray]); // Dependency on getCurrentValuesArray

    const updateSummary = useCallback(() => {
        const values = getCurrentValuesArray();
        const total = values.reduce((a, b) => a + b, 0);

        let summaryCards = [];

        summaryCards.push(
            <div key="total-income" className="summary-card">
                <h4>💰 Total Monthly Income</h4>
                <div className="amount">${total.toLocaleString()}</div>
            </div>
        );
        summaryCards.push(
            <div key="annual-income" className="summary-card">
                <h4>📅 Annual Income</h4>
                <div className="amount">${(total * 12).toLocaleString()}</div>
            </div>
        );

        // Find highest income source
        const maxIndex = values.indexOf(Math.max(...values));
        if (values[maxIndex] > 0) {
            const percentage = ((values[maxIndex] / total) * 100).toFixed(1);
            summaryCards.push(
                <div key="primary-source" className="summary-card">
                    <h4>🎯 Primary Income Source</h4>
                    <div className="amount">{incomeDataConfig.labels[maxIndex]}</div>
                    <div className="percentage">{percentage}% of total</div>
                </div>
            );
        }

        // Calculate passive vs active income
        // dividends, rental, interest, royalties
        const passiveIncome = incomeValues.dividends + incomeValues.rental + incomeValues.bank_interest + incomeValues.royalties;
        const passivePercentage = total > 0 ? ((passiveIncome / total) * 100).toFixed(1) : 0;

        summaryCards.push(
            <div key="passive-income" className="summary-card">
                <h4>🌱 Passive Income</h4>
                <div className="amount">${passiveIncome.toLocaleString()}</div>
                <div className="percentage">{passivePercentage}% of total</div>
            </div>
        );

        setSummaryData(summaryCards);
    }, [getCurrentValuesArray, incomeValues]); // Dependencies: values and incomeValues

    const updateAllCharts = useCallback(() => {
        createPieChart();
        createBarChart();
        updateSummary();
    }, [createPieChart, createBarChart, updateSummary]);

    // Effect to run on mount and whenever incomeValues change
    useEffect(() => {
        updateAllCharts();

        // Cleanup function for charts
        return () => {
            if (pieChartRef.current) {
                pieChartRef.current.destroy();
            }
            if (barChartRef.current) {
                barChartRef.current.destroy();
            }
        };
    }, [updateAllCharts]); // Re-run effect when updateAllCharts (and its dependencies) change

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setIncomeValues(prevValues => ({
            ...prevValues,
            [id]: parseFloat(value) || 0 // Ensure value is a number
        }));
    };

    return (
        <div className="income-body">
            <div className="income-container">
            <h1 className="income-header"><i class="fa-solid fa-money-bill-trend-up"></i> Income Distribution</h1>

            <div className="input-section">
                <div className="income-grid">
                    {incomeSources.map(source => (
                        <div key={source.id} className="income-item">
                            <label htmlFor={source.id}>
                                <span className="income-icon">{source.icon}</span>
                                {source.label}
                            </label>
                            <input
                                type="number"
                                id={source.id}
                                value={incomeValues[source.id]}
                                min="0"
                                onChange={handleInputChange}
                            />
                        </div>
                    ))}
                </div>

                <button className="update-btn" onClick={updateAllCharts}>
                    🔄 Update Charts
                </button>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h3>📊 Income Distribution (Pie Chart)</h3>
                    <div className="chart-wrapper">
                        <canvas ref={pieCanvasRef} id="pieChart"></canvas>
                    </div>
                </div>

                <div className="chart-container">
                    <h3>📊 Income Breakdown (Bar Chart)</h3>
                    <div className="chart-wrapper">
                        <canvas ref={barCanvasRef} id="barChart"></canvas>
                    </div>
                </div>
            </div>

            <div className="summary-section">
                <h3 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.6rem' }}>💡 Income Summary</h3>
                <div className="summary-grid">
                    {summaryData}
                </div>
            </div>
        </div>
        </div>
    );
}

export default UserIncome;