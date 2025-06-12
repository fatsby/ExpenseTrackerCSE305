import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import './css/userincome.css'; 
import FetchHelper from '@/utils/FetchHelper';
import StorageHelper from '@/utils/StorageHelper';

const UserIncome = () => {
  const token = localStorage.getItem('token');
  const fetchHelper = new FetchHelper(token);
  

  // State management
  const [userData, setUserData] = useState({
    name: localStorage.getItem('username'),
    totalIncome: 0
  });

  const [incomes, setIncomes] = useState([
    // { id: 1, category: "Monthly salary", description: "Software Engineer Salary", amount: 5000.00, date: "01 June 2025" },
    // { id: 2, category: "Freelance work", description: "Web Development Project", amount: 1200.00, date: "15 June 2025" },
    // { id: 3, category: "Dividend income", description: "Stock Dividends", amount: 300.00, date: "10 June 2025" },
    // { id: 4, category: "Bank interest", description: "Savings Account Interest", amount: 25.00, date: "01 June 2025" },
  ]);

  const categoryIncomeMap = {
    SALARY: 'Monthly salary',
    DIVIDEND: 'Dividend income',
    RENTAL: 'Rental Income',
    BANK_INTEREST: 'Bank interest',
    FREELANCE: 'Freelance work',
    BUSINESS: 'Business income',
    ROYALTY: 'Royalties',
    OTHER: 'Other',
  };

  function formatDate(dateString) {
    const opts = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', opts);
  }

  const [isBreakdownOpen, setIsBreakdownOpen] = useState(true);
  const [money, setMoney] = useState(0);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Monthly salary');
  const [activeChartTab, setActiveChartTab] = useState('category-chart');
  const [isLoading, setIsLoading] = useState(true);

  // Chart refs
  const categoryPieChartRef = useRef(null);
  const categoryBarChartRef = useRef(null);
  const monthlyLineChartRef = useRef(null);
  const chartInstancesRef = useRef({});

  // Calculate totals
  const totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);

  // Export functions
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(incomes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Incomes");
    XLSX.writeFile(wb, "incomes.xlsx");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yPos = 10;
    doc.text("Income Report", 10, yPos);
    yPos += 10;
    incomes.forEach((income, index) => {
      doc.text(`${index + 1}. ${income.description} (${income.category}): ${formatCurrency(income.amount)} on ${income.date}`, 10, yPos);
      yPos += 7;
      if (yPos > doc.internal.pageSize.height - 10) {
        doc.addPage();
        yPos = 10;
      }
    });
    doc.save("incomes.pdf");
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'Monthly salary': '💼',
      'Dividend income': '📈',
      'Rental Income': '🏠',
      'Bank interest': '🏦',
      'Freelance work': '💻',
      'Business income': '🏢',
      'Royalties': '👑',
    };
    return icons[category] || '💰';
  };

  // Handle adding new income
  const handleAddIncome = async () => {
    const amount = parseFloat(incomeAmount);
    if (!incomeDescription.trim() || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid description and amount');
      return;
    }

    const categoryCode =
      Object.entries(categoryIncomeMap).find(([, label]) => label === selectedCategory)?.[0] ||
      selectedCategory;

    const payload = {
      description: incomeDescription,
      amount,
      category: categoryCode
    };

    if (!token) {
      alert('Not authenticated');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/income/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to add income');
      }

      const newIncome = await res.json();

      setMoney(money+amount);
      setIncomes(prev => [
        ...prev,
        {
          id: newIncome.id,
          category: categoryIncomeMap[newIncome.category] || newIncome.category,
          description: newIncome.description,
          amount: newIncome.amount,
          date: formatDate(newIncome.date)
        }
      ]);

      // Reset the form
      setIncomeAmount('');
      setIncomeDescription('');
      setSelectedCategory(
        categoryIncomeMap[newIncome.category] || selectedCategory
      );

    } catch (err) {
      console.error(err);
      alert('Error adding income: ' + err.message);
    }
  };

  // Handle deleting income
  const handleDeleteIncome = async (id) => {
    const deletedIncome = incomes.find(income => income.id === id);
    setIncomes(prev => prev.filter(income => income.id !== id));
    if (deletedIncome) {
      setMoney(prev => prev - deletedIncome.amount);
    }
    try {
      const response = await fetch(`http://localhost:8080/api/income/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete income');
      }

      console.log(response.text());
    } catch {
      console.log(response.text());
    }
  };

  // Get chart data
  const getCategoryData = () => {
    const categories = {};
    incomes.forEach(income => {
      if (!categories[income.category]) {
        categories[income.category] = 0;
      }
      categories[income.category] += income.amount;
    });

    return {
      labels: Object.keys(categories),
      data: Object.values(categories)
    };
  };

  const getMonthlyData = () => {
    const months = {};
    incomes.forEach(income => {
      const dateParts = income.date.split(' ');
      if (dateParts.length >= 2) {
        const month = dateParts[1];
        if (!months[month]) {
          months[month] = 0;
        }
        months[month] += income.amount;
      }
    });

    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedMonths = {};

    monthOrder.forEach(month => {
      if (months[month]) {
        sortedMonths[month] = months[month];
      }
    });

    return {
      labels: Object.keys(sortedMonths),
      data: Object.values(sortedMonths)
    };
  };

  // Chart creation functions
  const createCategoryPieChart = () => {
    if (!categoryPieChartRef.current) return;

    const ctx = categoryPieChartRef.current.getContext('2d');
    const categoryData = getCategoryData();

    const backgroundColors = [
      'rgba(76, 175, 80, 0.7)',
      'rgba(33, 150, 243, 0.7)',
      'rgba(255, 193, 7, 0.7)',
      'rgba(156, 39, 176, 0.7)',
      'rgba(255, 87, 34, 0.7)',
      'rgba(0, 188, 212, 0.7)',
      'rgba(121, 85, 72, 0.7)',
    ];

    if (chartInstancesRef.current.categoryPie) {
      chartInstancesRef.current.categoryPie.destroy();
    }

    chartInstancesRef.current.categoryPie = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categoryData.labels,
        datasets: [{
          data: categoryData.data,
          backgroundColor: backgroundColors.slice(0, categoryData.labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  };

  const createCategoryBarChart = () => {
    if (!categoryBarChartRef.current) return;

    const ctx = categoryBarChartRef.current.getContext('2d');
    const categoryData = getCategoryData();

    if (chartInstancesRef.current.categoryBar) {
      chartInstancesRef.current.categoryBar.destroy();
    }

    chartInstancesRef.current.categoryBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categoryData.labels,
        datasets: [{
          label: 'Amount ($)',
          data: categoryData.data,
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '$' + value;
              }
            }
          }
        }
      }
    });
  };

  const createMonthlyLineChart = () => {
    if (!monthlyLineChartRef.current) return;

    const ctx = monthlyLineChartRef.current.getContext('2d');
    const monthlyData = getMonthlyData();

    if (chartInstancesRef.current.monthlyLine) {
      chartInstancesRef.current.monthlyLine.destroy();
    }

    chartInstancesRef.current.monthlyLine = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthlyData.labels,
        datasets: [{
          label: 'Monthly Income',
          data: monthlyData.data,
          fill: false,
          borderColor: 'rgba(76, 175, 80, 1)',
          tension: 0.1,
          pointBackgroundColor: 'rgba(76, 175, 80, 1)',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '$' + value;
              }
            }
          }
        }
      }
    });
  };

  //GET user money from db
    useEffect(() => {
      if (!token) return;
  
      fetchHelper.getUserMoney()
        .then(moneyFromDB => {
          setMoney(moneyFromDB);
        })
        .catch(err => {
          console.log("Error fetching user money: ", err);
        });
    }, []);

  // GET incomes from database
  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:8080/api/income', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load incomes');
        return res.json();
      })
      .then(data => {
        const transformed = data.map(item => ({
          id: item.id,
          category: categoryIncomeMap[item.category] || item.category,
          description: item.description,
          amount: item.amount,
          date: formatDate(item.date)
        }));
        setIncomes(transformed);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  // Update charts when incomes change
  useEffect(() => {
    if (!isLoading) {
      createCategoryPieChart();
      createCategoryBarChart();
      createMonthlyLineChart();
    }
  }, [incomes, isLoading]);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Cleanup charts on unmount
  useEffect(() => {
    return () => {
      Object.values(chartInstancesRef.current).forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div id="loading" className="loading">
        <img src="./src/assets/aroundtheworld.gif" alt="Loading..." className="loading-gif" />
      </div>
    );
  }

  return (
    <div className="income-vh">
      <div className="db-container">
        {/* Left Panel - Income List */}
        <div className="panel">
          <div className="income-header">
            <span className="welcome-user-ic">
              <h1>Income <span className="income-accent">Tracker</span></h1>
            </span>
          </div>

          <div className="total-amount income-gradient">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p>Total Money:</p>
                <h2 id="total-display" className="total-income">$ {money}</h2>
              </div>
              <div className="income-trend">
                <span className="trend-icon">📈</span>
                <span>Growing!</span>
              </div>
            </div>
          </div>

          <div>
            <div className="breakdown-header-ic" id="breakdown-toggle" onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}>
              <h3>Income Breakdown</h3>
              <span id="breakdown-icon-ic">{isBreakdownOpen ? '▲' : '▼'}</span>
            </div>

            <div id="income-list" className={!isBreakdownOpen ? 'hidden' : ''}>
              {incomes.map(income => (
                <div key={income.id} className="income-item">
                  <div className="income-info">
                    <div className="category-icon">{getCategoryIcon(income.category)}</div>
                    <div className="income-details">
                      <p><strong>{income.description}</strong></p>
                      <p style={{ fontSize: '12px', color: '#666' }}>{income.category}</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>{income.date}</p>
                    </div>
                  </div>
                  <div className="income-amount">
                    <p className="income-amount-text">+ $ {income.amount.toFixed(2)}</p>
                    <button className="delete-btn" onClick={() => handleDeleteIncome(income.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Add Income & User Info */}
        <div className="panel">
          <div className="user-info-ic">
            <div>
              <h2 id="user-fullname">{userData.name}</h2>
            </div>
            <div className="sign-out-btn-ic" id="sign-out-btn-ic">
              <button type="submit" onClick={() => { window.location.href = 'homepage'; StorageHelper.clearStorage();}}>Sign Out</button>
            </div>
          </div>

          {/* Income Summary */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>Income Summary</h3>
            <div className="income-summary-card">
              <div className="summary-item">
                <span className="summary-label">💰 Total Earned</span>
                <span className="summary-value">${totalIncomes.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">📊 Sources</span>
                <span className="summary-value">{incomes.length}</span>
              </div>
            </div>
          </div>

          {/* Add New Income */}
          <div>
            <h3 style={{ marginBottom: '10px' }}>Add Income</h3>
            <div>
              <div className="form-group">
                <input
                  type="number"
                  className="input-field"
                  placeholder="Amount"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Description"
                  value={incomeDescription}
                  onChange={(e) => setIncomeDescription(e.target.value)}
                />
              </div>

              <div className="radio-group-ic">
                {['Monthly salary', 'Dividend income', 'Rental Income', 'Bank interest', 'Freelance work', 'Business income', 'Royalties'].map(category => (
                  <div key={category} className="radio-option">
                    <input
                      type="radio"
                      name="category"
                      id={`category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <label htmlFor={`category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>{category}</label>
                  </div>
                ))}
              </div>

              <button id="add-income-btn" className="add-btn income-add-btn" onClick={handleAddIncome}>Add Income</button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-container-ic">
        <h3 className="analytic-ic">Income Analytics</h3>

        <div className="chart-tabs-ic">
          <div
            className={`chart-tab-ic ${activeChartTab === 'category-chart' ? 'active' : ''}`}
            onClick={() => setActiveChartTab('category-chart')}
          >
            By Category
          </div>
          <div
            className={`chart-tab-ic ${activeChartTab === 'monthly-chart' ? 'active' : ''}`}
            onClick={() => setActiveChartTab('monthly-chart')}
          >
            Monthly Trend
          </div>
        </div>

        <div className={`chart-content-ic ${activeChartTab === 'category-chart' ? 'active' : ''}`} id="category-chart">
          <div className="chart-wrapper-ic">
            <div className="chart-title-ic">Income Distribution</div>
            <canvas ref={categoryPieChartRef} id="categoryPieChart"></canvas>
          </div>

          <div className="chart-wrapper-ic">
            <div className="chart-title">Category Comparison</div>
            <canvas ref={categoryBarChartRef} id="categoryBarChart"></canvas>
          </div>
        </div>

        <div className={`chart-content-ic ${activeChartTab === 'monthly-chart' ? 'active' : ''}`} id="monthly-chart">
          <div className="chart-wrapper-ic">
            <div className="chart-title-ic">Monthly Income</div>
            <canvas ref={monthlyLineChartRef} id="monthlyLineChart"></canvas>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button className="export-btn-ic" onClick={exportToExcel}><i className="far fa-file-excel"></i> Export Excel File</button>
        <button className="export-btn-ic" onClick={exportToPDF}><i className="fa-regular fa-file-pdf"></i> Export PDF File</button>
      </div>
    </div>
  );
};

export default UserIncome;