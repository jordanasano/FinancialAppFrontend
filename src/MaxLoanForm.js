import { useState } from "react";
import FinancialAppApi from "./api";
import LoadingSpinner from "./LoadingSpinner"

function MaxLoanForm({ grossMonthlyIncome, onMaxLoanChange }) {
    const [formData, setFormData] = useState({"loanLength": "30"});
    const [maxLoan, setMaxLoan] = useState(null);
    const [monthlyPayment, setMonthlyPayment] = useState(null);
    const [loading, setLoading] = useState(false);
    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(st => ({
            ...st,
            [name]: value
        }));
    }
    async function handleSubmit(evt) {
        evt.preventDefault();
        // Gives error message if mortgageRate is not a valid float greater than 0
        if (!/^\d*\.?\d*$/.test(formData["mortgageRate"]) || parseFloat(formData["mortgageRate"]) <= 0) {
            alert("Mortgage rate must be number with a decimal that is greater than 0 (e.g., 3.14).");
            return false;
        }

        let maxLoanData = { ...formData, grossMonthlyIncome };
        for (let item in maxLoanData) {
            maxLoanData[item] = parseFloat(maxLoanData[item]);
        };
        maxLoanData["maxDti"] = maxLoanData["maxDti"] / 100;
        setLoading(st => true);
        let loan = await FinancialAppApi.calculateMaxLoan(maxLoanData);
        setLoading(st => false);
        setMaxLoan(st => loan);
        let monthlyPaymentData = {
            "loanLength": maxLoanData["loanLength"],
            "mortgageRate": maxLoanData["mortgageRate"],
            "loanAmount": loan
        };
        onMaxLoanChange(loan);
        let payment = await FinancialAppApi.calculateMonthlyPayment(monthlyPaymentData);
        setMonthlyPayment(st => payment);
    }
    return (
        <div>
            <form onSubmit={handleSubmit} class="d-flex justify-content-center">
                <div class="col">
                    <div class="row">
                        <title>Maximum Loan Available</title>
                    </div>
                    <div class="row">
                        <label htmlFor="loanLength">Loan Length:</label>
                        <select id="loanLength" name="loanLength" onChange={handleChange} required>
                            <option value="30"> 30</option>
                            <option value="15"> 15</option>
                        </select>
                    </div>
                    <div class="row">
                        <label htmlFor="mortgageRate">Mortgage Rate:</label>
                        <input id="mortgageRate" name="mortgageRate" onChange={handleChange} required></input>
                    </div>
                    <div class="row">
                        <label htmlFor="monthlyDebt">Total Monthly Debt:</label>
                        <input id="monthlyDebt" name="monthlyDebt" onChange={handleChange} type="number" min="0" required></input>
                    </div>
                    <div class="row">
                        <label htmlFor="maxDti">Max Debt to Income Ratio As Percentage:</label>
                        <input id="maxDti" name="maxDti" onChange={handleChange} type="number" min="0" required></input>
                    </div>
                    <div class="row">
                        {loading ?
                            <LoadingSpinner />
                            : <button class="btn btn-primary">Calculate Maximum Loan!</button>}
                    </div>
                </div>
            </form>
            <div class="col">
                <div class="row">
                    {maxLoan ? <p>You're maximum loan amount is ${maxLoan}</p> : null}
                </div>
                <div class="row">
                    {monthlyPayment ? <p>You're monthly payment on that loan is ${monthlyPayment}</p> : null}
                </div>
            </div>
        </div>
    );
}

export default MaxLoanForm;