import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MaxLoanForm from "./MaxLoanForm";
import FinancialAppApi from "./api";

// Mock the whole module
jest.mock("./api", () => ({
    __esModule: true,
    default: {
        calculateMaxLoan: jest.fn(),
        calculateMonthlyPayment: jest.fn(),
    },
}));

// Mock the loading spinner component
jest.mock("./LoadingSpinner", () => () => <div data-testid="spinner">Loading...</div>);

describe("MaxLoanForm", () => {
    const mockGrossMonthlyIncome = 10000;
    const mockOnMaxLoanChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders form inputs", () => {
        render(<MaxLoanForm grossMonthlyIncome={mockGrossMonthlyIncome} onMaxLoanChange={mockOnMaxLoanChange} />);

        expect(screen.getByLabelText(/Loan Length/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mortgage Rate/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Total Monthly Debt/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Max Debt to Income Ratio/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Calculate Maximum Loan!/i })).toBeInTheDocument();
    });

    test("shows validation alert on invalid mortgage rate", async () => {
        window.alert = jest.fn();

        render(<MaxLoanForm grossMonthlyIncome={mockGrossMonthlyIncome} onMaxLoanChange={mockOnMaxLoanChange} />);

        fireEvent.change(screen.getByLabelText(/Mortgage Rate/i), { target: { value: "-3" } });
        fireEvent.change(screen.getByLabelText(/Total Monthly Debt/i), { target: { value: "1000" } });
        fireEvent.change(screen.getByLabelText(/Max Debt to Income Ratio/i), { target: { value: "30" } });

        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Mortgage rate must be number"));
        });
    });

    test("calls APIs and displays results", async () => {
        FinancialAppApi.calculateMaxLoan.mockResolvedValue(400000);
        FinancialAppApi.calculateMonthlyPayment.mockResolvedValue(2500);

        render(<MaxLoanForm grossMonthlyIncome={mockGrossMonthlyIncome} onMaxLoanChange={mockOnMaxLoanChange} />);

        fireEvent.change(screen.getByLabelText(/Mortgage Rate/i), { target: { value: "3.5" } });
        fireEvent.change(screen.getByLabelText(/Total Monthly Debt/i), { target: { value: "1000" } });
        fireEvent.change(screen.getByLabelText(/Max Debt to Income Ratio/i), { target: { value: "30" } });

        fireEvent.click(screen.getByRole("button"));

        expect(await screen.findByText(/Your maximum loan amount is \$400000/)).toBeInTheDocument();
        expect(await screen.findByText(/Your monthly payment on that loan is \$2500/)).toBeInTheDocument();
        expect(mockOnMaxLoanChange).toHaveBeenCalledWith(400000);
    });

    test("shows error message if either API call returns null", async () => {
        FinancialAppApi.calculateMaxLoan.mockResolvedValue(null);
        FinancialAppApi.calculateMonthlyPayment.mockResolvedValue(null);

        render(<MaxLoanForm grossMonthlyIncome={mockGrossMonthlyIncome} onMaxLoanChange={mockOnMaxLoanChange} />);

        fireEvent.change(screen.getByLabelText(/Mortgage Rate/i), { target: { value: "3.5" } });
        fireEvent.change(screen.getByLabelText(/Total Monthly Debt/i), { target: { value: "1000" } });
        fireEvent.change(screen.getByLabelText(/Max Debt to Income Ratio/i), { target: { value: "30" } });

        fireEvent.click(screen.getByRole("button"));

        expect(await screen.findByText(/Error hit/)).toBeInTheDocument();
    });

    test("shows loading spinner during API call", async () => {
        let resolveLoan;
        let resolvePayment;

        // Step 1: First API mock
        FinancialAppApi.calculateMaxLoan.mockImplementation(() =>
            new Promise((res) => {
                resolveLoan = res;
            })
        );

        // Step 2: Second API mock
        FinancialAppApi.calculateMonthlyPayment.mockImplementation(() =>
            new Promise((res) => {
                resolvePayment = res;
            })
        );

        render(<MaxLoanForm grossMonthlyIncome={mockGrossMonthlyIncome} onMaxLoanChange={mockOnMaxLoanChange} />);

        fireEvent.change(screen.getByLabelText(/Mortgage Rate/i), { target: { value: "3.5" } });
        fireEvent.change(screen.getByLabelText(/Total Monthly Debt/i), { target: { value: "1000" } });
        fireEvent.change(screen.getByLabelText(/Max Debt to Income Ratio/i), { target: { value: "30" } });

        fireEvent.click(screen.getByRole("button"));

        // Step 3: Spinner should appear
        expect(await screen.findByTestId("spinner")).toBeInTheDocument();

        // Step 4: Resolve the first promise
        resolveLoan(400000);

        // Step 5: Wait until the second API mock is called
        await waitFor(() => {
            expect(FinancialAppApi.calculateMonthlyPayment).toHaveBeenCalled();
        });

        // Step 6: Now resolve the second promise
        resolvePayment(2500);

        // Wait for spinner to disappear and result to appear
        await waitFor(() => {
            expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(/Your maximum loan amount is \$400000/)).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText(/Your monthly payment on that loan is \$2500/)).toBeInTheDocument();
        });
    });

});
