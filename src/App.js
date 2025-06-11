import GrossSalaryForm from "./GrossSalaryForm";
import GeminiForm from "./GeminiForm";
import MaxLoanForm from "./MaxLoanForm";
import WrapperComponent from './WrapperComponent';
import './App.css';
import { useState } from "react";

function App() {
    const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(null);
    const [maxLoan, setMaxLoan] = useState(null);
    const [geminiHtmlString, setGeminiHtmlString] = useState(null);
    const [httpError, setHttpError] = useState(false);

    function onGrossMonthlyIncomeChange(newGrossMonthlyIncome) {
        setGrossMonthlyIncome(st => newGrossMonthlyIncome);
    }

    function onMaxLoanChange(newMaxLoan) {
        setMaxLoan(st => newMaxLoan);
    }
    function onGeminiHtmlStringChange(newGeminiHtmlString) {
        setGeminiHtmlString(st => newGeminiHtmlString);
        // If state of httpError is currently true and newGeminiHtmlString is not null, remove the error.
        if (httpError && newGeminiHtmlString !== null) setHttpError(st => false);
    }

    function onHttpErrorChange(newHttpError) {
        setHttpError(st => newHttpError);
    }
    return (
        <div className="container-fluid app-background">
            <WrapperComponent>
                <header>
                    <h1>Financial Insight Tool</h1>
                    <p className="subtitle">Estimate your max mortgage and get Gemini's advice instantly</p>
                </header>
                <GrossSalaryForm onGrossMonthlyIncomeChange={onGrossMonthlyIncomeChange} />
                {grossMonthlyIncome !== null ? <MaxLoanForm grossMonthlyIncome={grossMonthlyIncome} onMaxLoanChange={onMaxLoanChange} /> : null}
                {maxLoan !== null ? <GeminiForm maxLoan={maxLoan} onGeminiHtmlStringChange={onGeminiHtmlStringChange} onHttpErrorChange={onHttpErrorChange} /> : null}
                {geminiHtmlString !== null ?
                    <div className="card">
                        <h2 className="text-center">What Gemini Thinks...</h2>
                        <div dangerouslySetInnerHTML={{ __html: geminiHtmlString }} />
                    </div>
                    : null}
                {httpError ?
                    <div className ="card">
                        <h2 className="text-center">Gemini's hourly limit was reached. Please try again later!</h2>
                    </div>
                    : null}
            </WrapperComponent>
        </div>
    );
}

export default App;
