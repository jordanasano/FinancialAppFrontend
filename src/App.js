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

    function onGrossMonthlyIncomeChange(newGrossMonthlyIncome) {
        setGrossMonthlyIncome(st => newGrossMonthlyIncome);
    }
    function onMaxLoanChange(newMaxLoan) {
        setMaxLoan(st => newMaxLoan);
    }
    function onGeminiHtmlStringChange(newGeminiHtmlString) {
        setGeminiHtmlString(st => newGeminiHtmlString);
    }
    return (
        <div class="container-fluid app-background">
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
            </head>
            <WrapperComponent>
                <h1>Hi! Let's get started.</h1>
                <GrossSalaryForm onGrossMonthlyIncomeChange={onGrossMonthlyIncomeChange} />
                {grossMonthlyIncome ? <MaxLoanForm grossMonthlyIncome={grossMonthlyIncome} onMaxLoanChange={onMaxLoanChange} /> : null}
                {maxLoan ? <GeminiForm maxLoan={maxLoan} onGeminiHtmlStringChange={onGeminiHtmlStringChange} /> : null}
                {geminiHtmlString ?
                    <div>
                        <h2 class="text-center">What Gemini Thinks...</h2>
                        <div dangerouslySetInnerHTML={{ __html: geminiHtmlString }} />
                    </div>
                    : null}
            </WrapperComponent>
        </div>
    );
}

export default App;
