import logo from './logo.svg';
import GrossSalaryForm from "./GrossSalaryForm";
import MaxLoanForm from "./MaxLoanForm";
import './App.css';
import { useState } from "react";

function App() {
    const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(null)
    function onGrossMonthlyIncomeChange(newGrossMonthlyIncome) {
        setGrossMonthlyIncome(st => newGrossMonthlyIncome);
    }

    return (
        <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
                Hi! Let's get started.
            </p>
                <GrossSalaryForm onGrossMonthlyIncomeChange={onGrossMonthlyIncomeChange} />
                {grossMonthlyIncome ? <MaxLoanForm grossMonthlyIncome={grossMonthlyIncome} /> : null}
        </header>
        </div>
    );
}

export default App;
