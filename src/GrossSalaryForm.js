import { useState } from "react";
import FinancialAppApi from "./api";
import LoadingSpinner from "./LoadingSpinner"

function GrossSalaryForm({ onGrossMonthlyIncomeChange }) {
    const [formData, setFormData] = useState(new FormData());
    const [netMonthlyIncome, setNetMonthlyIncome] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(st => ({
            [name]: value
        }));
    }
    async function handleSubmit(evt) {
        evt.preventDefault();
        setLoading(st => true);
        let monthlyTakeHomePay = await FinancialAppApi.calculateMonthlyIncome(formData["annualIncome"]);
        setLoading(st => false);
        setNetMonthlyIncome(st => monthlyTakeHomePay.netMonthlyTakeHomePay);
        onGrossMonthlyIncomeChange(monthlyTakeHomePay.grossMonthlyTakeHomePay);
    }
    return (
        <div>
            <form onSubmit={handleSubmit} class="d-flex justify-content-center">
                <div class="col">
                    <div class="row">
                        <title>Annual Income to Net Monthly Income For California</title>
                    </div>
                    <div class="row">
                        <label htmlFor="annualIncome">Annual Income:</label>
                        <input id="annualIncome" name="annualIncome" onChange={handleChange} type="number" min="0" required></input>
                    </div>
                    <div class="row">
                        {loading ?
                            <LoadingSpinner />
                            : <button class="btn btn-primary">Calculate Monthly Income!</button>}
                    </div>
                </div>
            </form>
            {netMonthlyIncome ? <p>You're net monthly income is ${netMonthlyIncome}</p> : null}
        </div>
    );
}

export default GrossSalaryForm;