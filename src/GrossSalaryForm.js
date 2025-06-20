import { useState } from "react";
import FinancialAppApi from "./api";
import LoadingSpinner from "./LoadingSpinner"
import './WrapperComponent.css';

function GrossSalaryForm({ onGrossMonthlyIncomeChange }) {
    const [formData, setFormData] = useState(new FormData());
    const [netMonthlyIncome, setNetMonthlyIncome] = useState(null);
    const [loading, setLoading] = useState(false);
    const [httpError, setHttpError] = useState(false);

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

        // If API hits an error, set the error and prevent further processing
        if (!monthlyTakeHomePay) {
            setHttpError(st => true);
            setLoading(st => false);
            return;
        }

        if (httpError) setHttpError(st => false);

        setLoading(st => false);
        setNetMonthlyIncome(st => monthlyTakeHomePay.netMonthlyTakeHomePay);
        onGrossMonthlyIncomeChange(monthlyTakeHomePay.grossMonthlyTakeHomePay);
    }

    return (
        <div className="card">
            <form onSubmit={handleSubmit} className="d-flex justify-content-center">
                <div className="col">
                    <div className="row">
                        <title>Annual Income to Net Monthly Income For California</title>
                    </div>
                    <div className="row">
                        <label htmlFor="annualIncome">Annual Income:</label>
                        <input id="annualIncome" name="annualIncome" onChange={handleChange} type="number" min="1" required></input>
                    </div>
                    <div className="row">
                        {loading ?
                            <LoadingSpinner />
                            : <button className="btn btn-primary">Calculate Monthly Income!</button>}
                    </div>
                </div>
            </form>
            {!httpError ?
                netMonthlyIncome !== null ? <p>Your net monthly income is ${netMonthlyIncome}.</p> : null
                : <p>Error hit. Please double check your salary and try again!</p>}
        </div>
    );
}

export default GrossSalaryForm;