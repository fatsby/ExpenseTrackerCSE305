import React, { useState } from 'react';
import NavBar from './NavBar';
import DashBoard from './DashBoard';
import UserIncome from './UserIncome';

function FullDashBoard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userName] = useState(localStorage.getItem('username'));

    return (
        <>
            <NavBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                userName={userName}
            />
            <div> {/* Space for fixed navbar */}
                {activeTab === 'dashboard' ? <DashBoard /> : <UserIncome />}
            </div>
        </>
    );
}
export default FullDashBoard