import { useState } from "react";
import FinancialAppApi from "./api";

function GrossSalaryForm({ onGrossMonthlyIncomeChange }) {
    const [formData, setFormData] = useState(new FormData());
    const [netMonthlyIncome, setNetMonthlyIncome] = useState(null);
    const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(null);

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(st => ({
            [name]: value
        }));
    }
    async function handleSubmit(evt) {
        evt.preventDefault();
        let monthlyTakeHomePay = await FinancialAppApi.calculateMonthlyIncome(formData["annualIncome"]);
        setNetMonthlyIncome(st => monthlyTakeHomePay.netMonthlyTakeHomePay);
        setGrossMonthlyIncome(st => monthlyTakeHomePay.grossMonthlyTakeHomePay);
        onGrossMonthlyIncomeChange(monthlyTakeHomePay.grossMonthlyTakeHomePay);
    }
    return (
        <form onSubmit={handleSubmit}>
            <div class="col">
                <div class="row">
                    <title>Annual Income to Net Monthly Income For California</title>
                </div>
                <div class="row">
                    <label htmlFor="annualIncome">Annual Income:</label>
                    <input id="annualIncome" name="annualIncome" onChange={handleChange} type="number" required></input>
                </div>
                <div class="row">
                    <button class="btn btn-primary">Calculate Monthly Income!</button>
                </div>
                <div class="row">
                    {netMonthlyIncome ? <p>You're net monthly income is ${netMonthlyIncome}</p> : null}
                </div>
            </div>
        </form>
    );
}

export default GrossSalaryForm;