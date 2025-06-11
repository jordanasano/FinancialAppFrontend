import { useState } from "react";
import FinancialAppApi from "./api";
import LoadingSpinner from "./LoadingSpinner";
import './WrapperComponent.css';

function GeminiForm({ maxLoan, onGeminiHtmlStringChange, onHttpErrorChange }) {
    const [formData, setFormData] = useState(new FormData());
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
        var geminiData = {
            ...formData,
            maxLoan,
            "downPayment": parseInt(formData["downPayment"]),
            "allowableMilesFromCity": parseInt(formData["allowableMilesFromCity"])
        };
        setLoading(st => true);
        let geminiHtmlString = await FinancialAppApi.getGeminiRecommendation(geminiData);
        setLoading(st => false);

        // If API hits an error, set the error in parent component
        if (geminiHtmlString === null) onHttpErrorChange(st => true);
        onGeminiHtmlStringChange(geminiHtmlString);
    }

    return (
        <form onSubmit={handleSubmit} className="d-flex justify-content-center card">
            <div className="col">
                <div className="row">
                    <title>Generate the top 5 cities to live in, powered by Gemini!</title>
                </div>
                <div className="row">
                    <label htmlFor="profession">Your profession:</label>
                    <input id="profession" name="profession" onChange={handleChange} required></input>
                </div>
                <div className="row">
                    <label htmlFor="downPayment">Down Payment:</label>
                    <input id="downPayment" name="downPayment" onChange={handleChange} type="number" min="0" required></input>
                </div>
                <div className="row">
                    <label htmlFor="desiredCity">Most desired city:</label>
                    <input id="desiredCity" name="desiredCity" onChange={handleChange} required></input>
                </div>
                <div className="row">
                    <label htmlFor="allowableMilesFromCity">Allowables miles from desired city:</label>
                    <input id="allowableMilesFromCity" name="allowableMilesFromCity" onChange={handleChange} type="number" min="0" required></input>
                </div>
                <div className="row">
                    {loading ?
                        <LoadingSpinner />
                        : <button className="btn btn-primary">Get Gemini Recommendations!</button>}
                </div>
            </div>
        </form>
    );
}

export default GeminiForm;