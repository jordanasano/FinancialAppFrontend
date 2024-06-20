import GrossSalaryForm from "./GrossSalaryForm";
import GeminiForm from "./GeminiForm";
import MaxLoanForm from "./MaxLoanForm";
import WrapperComponent from './WrapperComponent';
import './App.css';
import { useState, useEffect } from "react";

function App() {
    const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(null);
    const [maxLoan, setMaxLoan] = useState(null);
    const [geminiHtmlString, setGeminiHtmlString] = useState(null);
    const [httpError, setHttpError] = useState(false);

    // Set the title of the page
    useEffect(() => { document.title = "Homebuyer's Tool" }, []);

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
        <div class="container-fluid app-background">
            <head>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
            </head>
            <WrapperComponent>
                <h1>Hi! Let's get started.</h1>
                <GrossSalaryForm onGrossMonthlyIncomeChange={onGrossMonthlyIncomeChange} />
                {grossMonthlyIncome !== null ? <MaxLoanForm grossMonthlyIncome={grossMonthlyIncome} onMaxLoanChange={onMaxLoanChange} /> : null}
                {maxLoan !== null ? <GeminiForm maxLoan={maxLoan} onGeminiHtmlStringChange={onGeminiHtmlStringChange} onHttpErrorChange={onHttpErrorChange} /> : null}
                {geminiHtmlString !== null ?
                    <div>
                        <h2 class="text-center">What Gemini Thinks...</h2>
                        <div dangerouslySetInnerHTML={{ __html: geminiHtmlString }} />
                    </div>
                    : null}
                {httpError ?
                    <div>
                        <h2 class="text-center">Gemini's hourly limit was reached. Please try again later!</h2>
                    </div>
                    : null}
            </WrapperComponent>
        </div>
    );
}

export default App;
