import { useState } from "react";
import FinancialAppApi from "./api";
function MaxLoanForm({grossMonthlyIncome}) {
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
        let payment = await FinancialAppApi.calculateMonthlyPayment(monthlyPaymentData);
        setMonthlyPayment(st => payment);
    }
    return (
        <form onSubmit={handleSubmit}>
            <title>Maximum Loan Available</title>
            <label htmlFor="loanLength">Loan Length:</label>
            <input id="loanLength" name="loanLength" onChange={handleChange} type="number" required></input>
            <label htmlFor="mortgageRate">Mortgage Rate:</label>
            <input id="mortgageRate" name="mortgageRate" onChange={handleChange} required></input>
            <label htmlFor="monthlyDebt">Total Monthly Debt:</label>
            <input id="monthlyDebt" name="monthlyDebt" onChange={handleChange} type="number" required></input>
            <label htmlFor="maxDti">Max Debt to Income Ratio:</label>
            <input id="maxDti" name="maxDti" onChange={handleChange} required></input>
            <button>Calculate Monthly Income!</button>
            {maxLoan ? <p>You're maximum loan amount is ${maxLoan}</p> : null}
            {monthlyPayment ? <p>You're monthly payment on that loan is ${monthlyPayment}</p> : null}
        </form>
    );
}

export default MaxLoanForm;