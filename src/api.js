import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:5000";

// Allowing CORS since all requests are controlled from my app.
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

class FinancialAppApi {
    static async request(endpoint, data = {}, method = "GET") {
        const url = `${BASE_URL}/${endpoint}`;
       
        const params = (method === "GET")
            ? data
            : {};

        try {
            const res = (await axios({ url, method, data, params }));
            return res.data;

        } catch (err) {
            let message = err.res.data.err.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    static async calculateMonthlyIncome(annualIncome) {
        let res = await this.request("monthlyTakeHomeForCA", { annualIncome }, "POST");
        return res;
    }

    static async calculateMaxLoan({ mortgageRate, grossMonthlyIncome, loanLength, monthlyDebt, maxDti }) {
        let res = await this.request("calculateMaxLoan", { mortgageRate, grossMonthlyIncome, loanLength, monthlyDebt, maxDti }, "POST");
        return res.maxLoan;
    }

    static async calculateMonthlyPayment({ loanLength, mortgageRate, loanAmount }) {
        let res = await this.request("calculateMonthlyPayment", { loanLength, mortgageRate, loanAmount }, "POST");
        return res.monthlyPayment;
    }

    static async getGeminiRecommendation({ maxLoan, downPayment, profession, desiredCity, allowableMilesFromCity }) {
        let res = await this.request(`affordableCities/${maxLoan}/${downPayment}/${profession}/${desiredCity}/${allowableMilesFromCity}`);
        return res;
    }
}

export default FinancialAppApi;