import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx'; // Import XLSX library
import { jsPDF } from 'jspdf'; // Import jsPDF library
import './css/dashboard.css';
import FetchHelper from '@/utils/FetchHelper';
import StorageHelper from '@/utils/StorageHelper';


const DashBoard = () => {
  const token = localStorage.getItem('token');
  const fetchHelper = new FetchHelper(token);

  // State management
  const [userData, setUserData] = useState({
    name: localStorage.getItem('username'),
    budget: 0,
    income: 8000
  });

  const [expenses, setExpenses] = useState([
    // { id: 1, category: "Food/Beverage", description: "Dinner", amount: 12.00, date: "21 May 2023" },
    // { id: 2, category: "Travel/Commute", description: "Cafe", amount: 240.00, date: "21 May 2023" },
    // { id: 3, category: "Food/Beverage", description: "Cafe", amount: 240.00, date: "21 May 2023" },
    // { id: 4, category: "Utilities", description: "Clothes", amount: 150.00, date: "15 May 2023" },
    // { id: 5, category: "Utilities", description: "buy onlyfans", amount: 150.00, date: "15 June 2023" },
    // { id: 6, category: "Health", description: "medicine", amount: 100, date: "15 July 2023" },
  ]);

  const categoryMap = {
    FOOD: 'Food/Beverage',
    TRANSPORT: 'Travel/Commute',
    UTILITIES: 'Utilities',
    HEALTH: 'Health',
    EDUCATION: 'Education',
    OTHER: 'Other',
    ENTERTAINMENT: 'Entertainment',
    GIFT: 'Gift',
  };

  function formatDate(dateString) {
    // e.g. "2025-06-09" → "09 June 2025"
    const opts = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', opts);
  }


  const [isBreakdownOpen, setIsBreakdownOpen] = useState(true);
  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  const [isIncomeEditing, setIsIncomeEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(5000);
  const [money, setMoney] = useState(0);
  const [incomeInput, setIncomeInput] = useState(8000);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Food/Beverage');
  const [activeChartTab, setActiveChartTab] = useState('category-chart');
  const [isLoading, setIsLoading] = useState(true);

  // Chart refs
  const categoryPieChartRef = useRef(null);
  const categoryBarChartRef = useRef(null);
  const monthlyLineChartRef = useRef(null);
  const chartInstancesRef = useRef({});

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetPercentage = Math.min(100, (totalExpenses / userData.budget) * 100);


  // Export functions
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
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
    doc.text("Expense Report", 10, yPos);
    yPos += 10;
    expenses.forEach((expense, index) => {
      doc.text(`${index + 1}. ${expense.description} (${expense.category}): ${formatCurrency(expense.amount)} on ${expense.date}`, 10, yPos);
      yPos += 7;
      if (yPos > doc.internal.pageSize.height - 10) { // Check if new page is needed
        doc.addPage();
        yPos = 10;
      }
    });
    doc.save("expenses.pdf");
  };


  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'Food/Beverage': '🍽️',
      'Travel/Commute': '🚗',
      'Utilities': '🧳',
      'Health': '🏥',
      'Entertainment': '🕹',
      'Education': '🏫',
      'Other': '💬',
    };
    return icons[category] || '🗿';
  };

  // Handle adding new expense
  const handleAddExpense = async () => {
    const amount = parseFloat(expenseAmount);
    if (!expenseDescription.trim() || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid description and amount');
      return;
    }

    const categoryCode =
      Object.entries(categoryMap).find(([, label]) => label === selectedCategory)?.[0] ||
      selectedCategory;

    const payload = {
      description: expenseDescription,
      amount,
      category: categoryCode
    };


    if (!token) {
      alert('Not authenticated');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/expenses/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to add expense');
      }

      const newExpense = await res.json();


      setMoney(money - amount);
      setExpenses(prev => [
        ...prev,
        {
          id: newExpense.id,
          category: categoryMap[newExpense.category] || newExpense.category,
          description: newExpense.description,
          amount: newExpense.amount,
          date: formatDate(newExpense.date)
        }
      ]);

      // Reset the form
      setExpenseAmount('');
      setExpenseDescription('');
      setSelectedCategory(
        categoryMap[newExpense.category] || selectedCategory
      );

    } catch (err) {
      console.error(err);
      alert('Error adding expense: ' + err.message);
    }
  };


  // Handle deleting expense
  const handleDeleteExpense = async (id) => {
    const deletedExpense = expenses.find(expense => expense.id === id);
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    if (deletedExpense) {
      setMoney(prev => prev + deletedExpense.amount);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete expense');
      }

      console.log(response.text());
    } catch {
      console.log(response.text());
    }
  };

  // Handle budget save
  const handleSaveBudget = async () => {
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setUserData(prev => ({ ...prev, budget: newBudget }));
    }
    setIsBudgetEditing(false);

    try {
      const response = await fetch(`http://localhost:8080/api/user/budget`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete expense');
      }

      console.log(response.text());
    } catch {
      console.log(response.text());
    }
  };


  // Get chart data
  const getCategoryData = () => {
    const categories = {};
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });

    return {
      labels: Object.keys(categories),
      data: Object.values(categories)
    };
  };

  const getMonthlyData = () => {
    const months = {};
    expenses.forEach(expense => {
      const dateParts = expense.date.split(' ');
      if (dateParts.length >= 2) {
        const month = dateParts[1];
        if (!months[month]) {
          months[month] = 0;
        }
        months[month] += expense.amount;
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
      'rgba(255, 99, 132, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(109, 236, 198, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(136, 77, 123, 0.7)',
      'rgba(76, 52, 147, 0.7)'
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
          backgroundColor: 'rgb(118, 89, 159)',
          borderColor: 'rgb(255, 255, 255)',
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
          label: 'Monthly Expenses',
          data: monthlyData.data,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
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


  //SET user budget from db
  useEffect(() => {
    if (!token) return;

    fetchHelper.getUserBudget()
      .then(budgetFromDB => {
        setUserData(prevData => ({
          ...prevData,
          budget: budgetFromDB,
        }));
      })
      .catch(error => {
        console.error('Error fetching budget:', error);
      });
  }, []);

  //GET expenses from database
  useEffect(() => {
    if (!token) return;

    fetchHelper.getExpenses()
      .then(data => {
        const transformed = data.map(item => ({
          id: item.id,
          category: categoryMap[item.category] || item.category,
          description: item.description,
          amount: item.amount,
          date: formatDate(item.date),
        }));
        setExpenses(transformed);
      })
      .catch(err => {
        console.error('Error fetching expenses:', err);
      });
  }, []);

  // Update charts when expenses change
  useEffect(() => {
    if (!isLoading) {
      createCategoryPieChart();
      createCategoryBarChart();
      createMonthlyLineChart();
    }
  }, [expenses, isLoading]);

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
    <div className="dashboard-vh">
      <div className="db-container">
        {/* Left Panel - Expense List */}
        <div className="panel">
          <div className="expense-header">
            <span className="welcome-user">
              <h1>Hello, <span id="user-firstname">{userData.name.split(' ')[0]}</span></h1>
            </span>
          </div>

          <div className="total-amount">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p>Total Money:</p>
                <h2 id="total-display" className="total-spending">$ {money}</h2>
              </div>
              {/* <div id="budget-alert">
                <span className="alert-icon">⚠️</span>
                <span>Budget alert!</span>
              </div> */}
            </div>
          </div>

          <div>
            <div className="breakdown-header" id="breakdown-toggle" onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}>
              <h3>Breakdown</h3>
              <span id="breakdown-icon">{isBreakdownOpen ? '▲' : '▼'}</span>
            </div>

            <div id="expense-list" className={!isBreakdownOpen ? 'hidden' : ''}>
              {expenses.map(expense => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <div className="category-icon">{getCategoryIcon(expense.category)}</div>
                    <div className="expense-details">
                      <p><strong>{expense.description}</strong></p>
                      <p style={{ fontSize: '12px', color: '#666' }}>{expense.category}</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>{expense.date}</p>
                    </div>
                  </div>
                  <div className="expense-amount">
                    <p className="expense-amount">- $ {expense.amount.toFixed(2)}</p>
                    <button className="delete-btn" onClick={() => handleDeleteExpense(expense.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Add Expense & Settings */}
        <div className="panel">
          <div className="user-info">
            <div>
              <h2 id="user-fullname">{userData.name}</h2>
            </div>
            <div className="sign-out-btn" id="sign-out-btn">
              <button type="submit" onClick={() => { window.location.href = 'homepage'; StorageHelper.clearStorage(); }}>Sign Out</button>
            </div>
          </div>

          {/* Budget Status */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>Budget Status</h3>
            <div className="progress-bar">
              <div
                className="progress"
                id="budget-progress"
                style={{
                  width: `${budgetPercentage}%`,
                  backgroundColor: budgetPercentage > 100 ? '#e53935' : budgetPercentage > 75 ? '#ffc107' : '#4caf50'
                }}
              ></div>
            </div>
            <div className="progress-info">
              <span id="spent-amount">💸{totalExpenses.toFixed(2)} spent</span>
              <span id="budget-amount">💲Budget: ${userData.budget.toFixed(2)}</span>
            </div>
          </div>

          {/* Budget & Income Management */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>Financial Management</h3>

            <div className="financial-item">
              <span>Monthly Budget:</span>
              <div id="budget-display" className={isBudgetEditing ? 'hidden' : ''}>
                <span id="budget-value">${userData.budget.toFixed(2)}</span>
                <button className="edit-btn" onClick={() => { setIsBudgetEditing(true); setBudgetInput(userData.budget); }}>Edit</button>
              </div>
              <div id="budget-edit" className={`edit-inline ${!isBudgetEditing ? 'hidden' : ''}`}>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                />
                <button className="save-btn" onClick={handleSaveBudget}>Save</button>
              </div>
            </div>

            {/* <div className="financial-item">
              <span>Monthly Income:</span>
              <div id="income-display" className={isIncomeEditing ? 'hidden' : ''}>
                <span id="income-value">${userData.income.toFixed(2)}</span>
                <button className="edit-btn" onClick={() => { setIsIncomeEditing(true); setIncomeInput(userData.income); }}>Edit</button>
              </div>
              <div id="income-edit" className={`edit-inline ${!isIncomeEditing ? 'hidden' : ''}`}>
                <input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                />
                <button className="save-btn" onClick={handleSaveIncome}>Save</button>
              </div>
            </div> */}
          </div>

          {/* Add New Expense */}
          <div>
            <h3 style={{ marginBottom: '10px' }}>Add Expense</h3>
            <div>
              <div className="form-group">
                <input
                  type="number"
                  className="input-field"
                  placeholder="Amount"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Description"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                />
              </div>

              <div className="radio-group">
                {['Food/Beverage', 'Travel/Commute', 'Utilities', 'Entertainment', 'Education', 'Health', 'Other'].map(category => (
                  <div key={category} className="radio-option">
                    <input
                      type="radio"
                      name="category"
                      id={`category-${category.toLowerCase().replace('/', '-')}`}
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <label htmlFor={`category-${category.toLowerCase().replace('/', '-')}`}>{category}</label>
                  </div>
                ))}
              </div>

              <button id="add-expense-btn" className="add-btn" onClick={handleAddExpense}>Add to Expense</button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        <h3 className="analytic">Expense Analytics</h3>

        <div className="chart-tabs">
          <div
            className={`chart-tab ${activeChartTab === 'category-chart' ? 'active' : ''}`}
            onClick={() => setActiveChartTab('category-chart')}
          >
            By Category
          </div>
          <div
            className={`chart-tab ${activeChartTab === 'monthly-chart' ? 'active' : ''}`}
            onClick={() => setActiveChartTab('monthly-chart')}
          >
            Monthly Trend
          </div>
        </div>

        <div className={`chart-content ${activeChartTab === 'category-chart' ? 'active' : ''}`} id="category-chart">
          <div className="chart-wrapper">
            <div className="chart-title">Category Distribution</div>
            <canvas ref={categoryPieChartRef} id="categoryPieChart"></canvas>
          </div>

          <div className="chart-wrapper">
            <div className="chart-title">Category Comparison</div>
            <canvas ref={categoryBarChartRef} id="categoryBarChart"></canvas>
          </div>
        </div>

        <div className={`chart-content ${activeChartTab === 'monthly-chart' ? 'active' : ''}`} id="monthly-chart">
          <div className="chart-wrapper">
            <div className="chart-title">Monthly Expenses</div>
            <canvas ref={monthlyLineChartRef} id="monthlyLineChart"></canvas>
          </div>
        </div>
      </div>

      <div className="button-container">

        <button className="export-btn" onClick={exportToExcel}><i className="far fa-file-excel"></i> Export Excel File</button>
        <button className="export-btn" onClick={exportToPDF}><i className="fa-regular fa-file-pdf"></i> Export PDF File</button>

      </div>
    </div>
  );
};

export default DashBoard;