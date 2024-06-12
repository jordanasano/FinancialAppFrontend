import logo from './logo.svg';
import GrossSalaryForm from "./GrossSalaryForm";
import GeminiForm from "./GeminiForm";
import MaxLoanForm from "./MaxLoanForm";
import WrapperComponent from './WrapperComponent';
import './App.css';
import { useState } from "react";

function App() {
    const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(null);
    const [maxLoan, setMaxLoan] = useState(null);

    function onGrossMonthlyIncomeChange(newGrossMonthlyIncome) {
        setGrossMonthlyIncome(st => newGrossMonthlyIncome);
    }
    function onMaxLoanChange(newMaxLoan) {
        setMaxLoan(st => newMaxLoan);
    }

    return (
        <div class="container-fluid bg-secondary bg-opacity-50">
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
            </head>
            <WrapperComponent>
                <p>Hi! Let's get started.</p>
                <GrossSalaryForm onGrossMonthlyIncomeChange={onGrossMonthlyIncomeChange} />
                {grossMonthlyIncome ? <MaxLoanForm grossMonthlyIncome={grossMonthlyIncome} onMaxLoanChange={onMaxLoanChange} /> : null}
                {maxLoan ? <GeminiForm maxLoan={maxLoan} /> : null}
            </WrapperComponent>
        </div>
    );
}

export default App;
