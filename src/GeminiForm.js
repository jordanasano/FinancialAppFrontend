import { useState } from "react";
import FinancialAppApi from "./api";
import LoadingSpinner from "./LoadingSpinner"

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
        if (geminiHtmlString === null) onHttpErrorChange(st => true);
        onGeminiHtmlStringChange(geminiHtmlString);
    }

    return (
        <form onSubmit={handleSubmit} class="d-flex justify-content-center">
            <div class="col">
                <div class="row">
                    <title>Generate the top 5 cities to live in, powered by Gemini!</title>
                </div>
                <div class="row">
                    <label htmlFor="profession">Your profession:</label>
                    <input id="profession" name="profession" onChange={handleChange} required></input>
                </div>
                <div class="row">
                    <label htmlFor="downPayment">Down Payment:</label>
                    <input id="downPayment" name="downPayment" onChange={handleChange} type="number" min="0" required></input>
                </div>
                <div class="row">
                    <label htmlFor="desiredCity">Most desired city:</label>
                    <input id="desiredCity" name="desiredCity" onChange={handleChange} required></input>
                </div>
                <div class="row">
                    <label htmlFor="allowableMilesFromCity">Allowables miles from desired city:</label>
                    <input id="allowableMilesFromCity" name="allowableMilesFromCity" onChange={handleChange} type="number" min="0" required></input>
                </div>
                <div class="row">
                    {loading ?
                        <LoadingSpinner />
                        : <button class="btn btn-primary">Get Gemini Recommendations!</button>}
                </div>
            </div>
        </form>
    );
}

export default GeminiForm;