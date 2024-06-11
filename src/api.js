import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:5000";

// Allowing CORS since all requests are controlled from my app.
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

class FinancialAppApi {
    static async request(endpoint, data = {}, method = "get") {
        const url = `${BASE_URL}/${endpoint}`;
       
        const params = (method === "get")
            ? data
            : {};

        try {
            const res = (await axios({ url, method, data, params }));
            return res.data;

        } catch (err) {
            let message = err.response.data.error.message;
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
}

export default FinancialAppApi;