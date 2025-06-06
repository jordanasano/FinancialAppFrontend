import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GeminiForm from './GeminiForm';
import FinancialAppApi from './api';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';

// Fully mock the API module and its method
jest.mock('./api', () => ({
    __esModule: true,
    default: {
        getGeminiRecommendation: jest.fn(),
    },
}));

jest.mock('axios');
jest.mock('./LoadingSpinner', () => () => <div data-testid="loading-spinner">Loading...</div>);

describe('GeminiForm', () => {
    const MAX_LOAN = 300000;
    const PROFESSION_LABEL = /your profession/i;
    const DOWN_PAYMENT_LABEL = /down payment/i;
    const DESIRED_CITY_LABEL = /most desired city/i;
    const ALLOWABLE_MILES_LABEL = /allowables miles from desired city/i;
    const SUBMIT_BUTTON_TEXT = /get gemini recommendations!/i;
    const LOADING_SPINNER_TESTID = 'loading-spinner';

    const PROFESSION_VALUE = 'Engineer';
    const DOWN_PAYMENT_VALUE = '12345';
    const DESIRED_CITY_VALUE = 'San Francisco';
    const ALLOWABLE_MILES_VALUE = '67';
    const API_SUCCESS_RESPONSE = '<p>Recommendation</p>';
    const API_ERROR_RESPONSE = null;

    let onGeminiHtmlStringChange;
    let onHttpErrorChange;

    beforeEach(() => {
        onGeminiHtmlStringChange = jest.fn();
        onHttpErrorChange = jest.fn();
        FinancialAppApi.getGeminiRecommendation.mockReset();
        FinancialAppApi.getGeminiRecommendation.mockResolvedValue(API_SUCCESS_RESPONSE);
    });

    it('renders all inputs and submit button initially', () => {
        render(
            <GeminiForm
                maxLoan={MAX_LOAN}
                onGeminiHtmlStringChange={onGeminiHtmlStringChange}
                onHttpErrorChange={onHttpErrorChange}
            />
        );

        expect(screen.getByLabelText(PROFESSION_LABEL)).toBeInTheDocument();
        expect(screen.getByLabelText(DOWN_PAYMENT_LABEL)).toBeInTheDocument();
        expect(screen.getByLabelText(DESIRED_CITY_LABEL)).toBeInTheDocument();
        expect(screen.getByLabelText(ALLOWABLE_MILES_LABEL)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: SUBMIT_BUTTON_TEXT })).toBeInTheDocument();
    });

    it('updates form state on input change', () => {
        render(
            <GeminiForm
                maxLoan={MAX_LOAN}
                onGeminiHtmlStringChange={onGeminiHtmlStringChange}
                onHttpErrorChange={onHttpErrorChange}
            />
        );

        fireEvent.change(screen.getByLabelText(PROFESSION_LABEL), { target: { value: PROFESSION_VALUE } });
        fireEvent.change(screen.getByLabelText(DOWN_PAYMENT_LABEL), { target: { value: DOWN_PAYMENT_VALUE } });
        fireEvent.change(screen.getByLabelText(DESIRED_CITY_LABEL), { target: { value: DESIRED_CITY_VALUE } });
        fireEvent.change(screen.getByLabelText(ALLOWABLE_MILES_LABEL), { target: { value: ALLOWABLE_MILES_VALUE } });

        // No direct state access, so just confirming no errors thrown
    });

    it('shows loading spinner while waiting for API response and disables submit button', async () => {
        FinancialAppApi.getGeminiRecommendation.mockResolvedValue(API_SUCCESS_RESPONSE);

        render(
            <GeminiForm
                maxLoan={MAX_LOAN}
                onGeminiHtmlStringChange={onGeminiHtmlStringChange}
                onHttpErrorChange={onHttpErrorChange}
            />
        );

        fireEvent.change(screen.getByLabelText(PROFESSION_LABEL), { target: { value: PROFESSION_VALUE } });
        fireEvent.change(screen.getByLabelText(DOWN_PAYMENT_LABEL), { target: { value: DOWN_PAYMENT_VALUE } });
        fireEvent.change(screen.getByLabelText(DESIRED_CITY_LABEL), { target: { value: DESIRED_CITY_VALUE } });
        fireEvent.change(screen.getByLabelText(ALLOWABLE_MILES_LABEL), { target: { value: ALLOWABLE_MILES_VALUE } });

        fireEvent.click(screen.getByRole('button', { name: SUBMIT_BUTTON_TEXT }));

        expect(screen.getByTestId(LOADING_SPINNER_TESTID)).toBeInTheDocument();

        await waitFor(() => expect(FinancialAppApi.getGeminiRecommendation).toHaveBeenCalled());

        await waitFor(() => {
            expect(screen.queryByTestId(LOADING_SPINNER_TESTID)).not.toBeInTheDocument();
        });

        expect(onGeminiHtmlStringChange).toHaveBeenCalledWith(API_SUCCESS_RESPONSE);
    });

    it('passes correct data object to API, including maxLoan and parsed numbers', async () => {
        FinancialAppApi.getGeminiRecommendation.mockResolvedValue(API_SUCCESS_RESPONSE);

        render(
            <GeminiForm
                maxLoan={MAX_LOAN}
                onGeminiHtmlStringChange={onGeminiHtmlStringChange}
                onHttpErrorChange={onHttpErrorChange}
            />
        );

        fireEvent.change(screen.getByLabelText(PROFESSION_LABEL), { target: { value: PROFESSION_VALUE } });
        fireEvent.change(screen.getByLabelText(DOWN_PAYMENT_LABEL), { target: { value: DOWN_PAYMENT_VALUE } });
        fireEvent.change(screen.getByLabelText(DESIRED_CITY_LABEL), { target: { value: DESIRED_CITY_VALUE } });
        fireEvent.change(screen.getByLabelText(ALLOWABLE_MILES_LABEL), { target: { value: ALLOWABLE_MILES_VALUE } });

        fireEvent.click(screen.getByRole('button', { name: SUBMIT_BUTTON_TEXT }));

        await waitFor(() => expect(FinancialAppApi.getGeminiRecommendation).toHaveBeenCalled());

        const calledWith = FinancialAppApi.getGeminiRecommendation.mock.calls[0][0];

        expect(calledWith).toMatchObject({
            profession: PROFESSION_VALUE,
            downPayment: parseInt(DOWN_PAYMENT_VALUE, 10),
            desiredCity: DESIRED_CITY_VALUE,
            allowableMilesFromCity: parseInt(ALLOWABLE_MILES_VALUE, 10),
            maxLoan: MAX_LOAN,
        });
    });

    it('calls onHttpErrorChange(true) if API returns null', async () => {
        FinancialAppApi.getGeminiRecommendation.mockResolvedValue(API_ERROR_RESPONSE);

        render(
            <GeminiForm
                maxLoan={MAX_LOAN}
                onGeminiHtmlStringChange={onGeminiHtmlStringChange}
                onHttpErrorChange={onHttpErrorChange}
            />
        );

        fireEvent.change(screen.getByLabelText(PROFESSION_LABEL), { target: { value: PROFESSION_VALUE } });
        fireEvent.change(screen.getByLabelText(DOWN_PAYMENT_LABEL), { target: { value: DOWN_PAYMENT_VALUE } });
        fireEvent.change(screen.getByLabelText(DESIRED_CITY_LABEL), { target: { value: DESIRED_CITY_VALUE } });
        fireEvent.change(screen.getByLabelText(ALLOWABLE_MILES_LABEL), { target: { value: ALLOWABLE_MILES_VALUE } });

        fireEvent.click(screen.getByRole('button', { name: SUBMIT_BUTTON_TEXT }));

        await waitFor(() => expect(FinancialAppApi.getGeminiRecommendation).toHaveBeenCalled());

        await waitFor(() => expect(onHttpErrorChange).toHaveBeenCalled());
        expect(onGeminiHtmlStringChange).toHaveBeenCalledWith(API_ERROR_RESPONSE);
    });
});
