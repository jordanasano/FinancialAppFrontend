import { useState } from "react";
import FinancialAppApi from "./api";

function MaxLoanForm({ grossMonthlyIncome, onMaxLoanChange }) {
    const [formData, setFormData] = useState(new FormData());
    const [maxLoan, setMaxLoan] = useState(null);
    const [monthlyPayment, setMonthlyPayment] = useState(null);

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(st => ({
            ...st,
            [name]: value
        }));
    }
    async function handleSubmit(evt) {
        evt.preventDefault();
        let maxLoanData = { ...formData, grossMonthlyIncome };
        for (let item in maxLoanData) {
            maxLoanData[item] = parseFloat(maxLoanData[item]);
        };
        let loan = await FinancialAppApi.calculateMaxLoan(maxLoanData);
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
        <form onSubmit={handleSubmit}>
            <div class="col">
                <div class="row">
                    <title>Maximum Loan Available</title>
                </div>
                <div class="row">
                    <label htmlFor="loanLength">Loan Length:</label>
                    <input id="loanLength" name="loanLength" onChange={handleChange} type="number" required></input>
                </div>
                <div class="row">
                    <label htmlFor="mortgageRate">Mortgage Rate:</label>
                    <input id="mortgageRate" name="mortgageRate" onChange={handleChange} required></input>
                </div>
                <div class="row">
                    <label htmlFor="monthlyDebt">Total Monthly Debt:</label>
                    <input id="monthlyDebt" name="monthlyDebt" onChange={handleChange} type="number" required></input>
                </div>
                <div class="row">
                    <label htmlFor="maxDti">Max Debt to Income Ratio:</label>
                    <input id="maxDti" name="maxDti" onChange={handleChange} required></input>
                </div>
                <div class="row">
                    <button class="btn btn-primary">Calculate Maximum Loan!</button>
                </div>
                <div class="row">
                    {maxLoan ? <p>You're maximum loan amount is ${maxLoan}</p> : null}
                </div>
                <div class="row">
                    {monthlyPayment ? <p>You're monthly payment on that loan is ${monthlyPayment}</p> : null}
                </div>
            </div>
        </form>
    );
}

export default MaxLoanForm;