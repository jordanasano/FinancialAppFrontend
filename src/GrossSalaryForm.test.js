import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GrossSalaryForm from './GrossSalaryForm';
import FinancialAppApi from './api';
import axios from 'axios';

jest.mock('./api', () => ({
    __esModule: true,
    default: {
        calculateMonthlyIncome: jest.fn(),
    },
}));
jest.mock('axios');
jest.mock('./LoadingSpinner', () => () => <div data-testid="loading-spinner">Loading...</div>);

describe('GrossSalaryForm', () => {
    const ANNUAL_INCOME_LABEL = /annual income/i;
    const SUBMIT_BUTTON_TEXT = /calculate monthly income!/i;
    const LOADING_SPINNER_TESTID = 'loading-spinner';

    const MOCK_INCOME = 120000;
    const API_SUCCESS_RESPONSE = {
        grossMonthlyTakeHomePay: 10000,
        netMonthlyTakeHomePay: 7500,
    };

    let onGrossMonthlyIncomeChange;

    beforeEach(() => {
        onGrossMonthlyIncomeChange = jest.fn();
        FinancialAppApi.calculateMonthlyIncome.mockReset();
    });

    it('renders input and submit button initially', () => {
        render(<GrossSalaryForm onGrossMonthlyIncomeChange={onGrossMonthlyIncomeChange} />);

        expect(screen.getByLabelText(ANNUAL_INCOME_LABEL)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: SUBMIT_BUTTON_TEXT })).toBeInTheDocument();
    });

    it('shows loading spinner and then net income on successful API call', async () => {
        FinancialAppApi.calculateMonthlyIncome.mockResolvedValue(API_SUCCESS_RESPONSE);

        render(<GrossSalaryForm onGrossMonthlyIncomeChange={onGrossMonthlyIncomeChange} />);

        fireEvent.change(screen.getByLabelText(ANNUAL_INCOME_LABEL), {
            target: { value: MOCK_INCOME },
        });

        fireEvent.click(screen.getByRole('button', { name: SUBMIT_BUTTON_TEXT }));

        // Expect loading spinner appears
        expect(screen.getByTestId(LOADING_SPINNER_TESTID)).toBeInTheDocument();

        // Wait for API call
        await waitFor(() =>
            expect(FinancialAppApi.calculateMonthlyIncome).toHaveBeenCalledWith(String(MOCK_INCOME))
        );

        // Spinner should disappear
        await waitFor(() =>
            expect(screen.queryByTestId(LOADING_SPINNER_TESTID)).not.toBeInTheDocument()
        );

        // Output should appear
        expect(screen.getByText(/your net monthly income is \$7500/i)).toBeInTheDocument();
        expect(onGrossMonthlyIncomeChange).toHaveBeenCalledWith(10000);
    });

    it('shows error message when API returns null', async () => {
        FinancialAppApi.calculateMonthlyIncome.mockResolvedValue(null);

        render(<GrossSalaryForm onGrossMonthlyIncomeChange={onGrossMonthlyIncomeChange} />);

        fireEvent.change(screen.getByLabelText(ANNUAL_INCOME_LABEL), {
            target: { value: MOCK_INCOME },
        });

        fireEvent.click(screen.getByRole('button', { name: SUBMIT_BUTTON_TEXT }));

        // Spinner appears
        expect(screen.getByTestId(LOADING_SPINNER_TESTID)).toBeInTheDocument();

        // Wait until spinner goes away
        await waitFor(() =>
            expect(screen.queryByTestId(LOADING_SPINNER_TESTID)).not.toBeInTheDocument()
        );

        // Error message should be visible
        expect(
            screen.getByText(/error hit\. please double check your salary and try again!/i)
        ).toBeInTheDocument();

        expect(onGrossMonthlyIncomeChange).not.toHaveBeenCalled();
    });

    it('clears error state after successful retry', async () => {
        FinancialAppApi.calculateMonthlyIncome
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(API_SUCCESS_RESPONSE);

        render(<GrossSalaryForm onGrossMonthlyIncomeChange={onGrossMonthlyIncomeChange} />);

        // First attempt (failure)
        fireEvent.change(screen.getByLabelText(ANNUAL_INCOME_LABEL), {
            target: { value: MOCK_INCOME },
        });
        fireEvent.click(screen.getByRole('button', { name: SUBMIT_BUTTON_TEXT }));

        await waitFor(() =>
            expect(screen.queryByTestId(LOADING_SPINNER_TESTID)).not.toBeInTheDocument()
        );

        expect(screen.getByText(/error hit/i)).toBeInTheDocument();

        // Retry (success)
        fireEvent.click(screen.getByRole('button', { name: SUBMIT_BUTTON_TEXT }));

        await waitFor(() =>
            expect(FinancialAppApi.calculateMonthlyIncome).toHaveBeenCalledTimes(2)
        );

        await waitFor(() =>
            expect(screen.queryByTestId(LOADING_SPINNER_TESTID)).not.toBeInTheDocument()
        );

        expect(screen.getByText(/your net monthly income is \$7500/i)).toBeInTheDocument();
        expect(onGrossMonthlyIncomeChange).toHaveBeenCalledWith(10000);
    });
});
