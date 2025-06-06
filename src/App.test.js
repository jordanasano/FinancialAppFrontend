import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Constants for repeated text
const HEADER_TEXT = "Hi! Let's get started.";
const SET_GROSS_INCOME = 'Set Gross Income';
const SET_MAX_LOAN = 'Set Max Loan';
const SET_GEMINI_HTML = 'Set Gemini HTML';
const TRIGGER_HTTP_ERROR = 'Trigger HTTP Error';
const GEMINI_HTML_TITLE = 'What Gemini Thinks...';
const GEMINI_HTML_CONTENT = 'Gemini HTML';
const HTTP_ERROR_MESSAGE = "Gemini's hourly limit was reached. Please try again later!";

// Mock child components to isolate App tests
jest.mock('./GrossSalaryForm', () => (props) => {
    return (
        <button onClick={() => props.onGrossMonthlyIncomeChange(5000)}>
            {SET_GROSS_INCOME}
        </button>
    );
});

jest.mock('./MaxLoanForm', () => (props) => {
    return (
        <button onClick={() => props.onMaxLoanChange(300000)}>
            {SET_MAX_LOAN}
        </button>
    );
});

jest.mock('./GeminiForm', () => (props) => {
    return (
        <>
            <button onClick={() => props.onGeminiHtmlStringChange(`<p>${GEMINI_HTML_CONTENT}</p>`)}>
                {SET_GEMINI_HTML}
            </button>
            <button onClick={() => props.onHttpErrorChange(true)}>
                {TRIGGER_HTTP_ERROR}
            </button>
        </>
    );
});

describe('App component', () => {
    it('renders initial state and child components', () => {
        render(<App />);
        expect(screen.getByText(HEADER_TEXT)).toBeInTheDocument();
        expect(screen.getByText(SET_GROSS_INCOME)).toBeInTheDocument();

        expect(screen.queryByText(SET_MAX_LOAN)).toBeNull();
        expect(screen.queryByText(SET_GEMINI_HTML)).toBeNull();
    });

    it('shows MaxLoanForm after setting gross monthly income', () => {
        render(<App />);
        fireEvent.click(screen.getByText(SET_GROSS_INCOME));
        expect(screen.getByText(SET_MAX_LOAN)).toBeInTheDocument();
    });

    it('shows GeminiForm after setting max loan', () => {
        render(<App />);
        fireEvent.click(screen.getByText(SET_GROSS_INCOME));
        fireEvent.click(screen.getByText(SET_MAX_LOAN));
        expect(screen.getByText(SET_GEMINI_HTML)).toBeInTheDocument();
    });

    it('displays Gemini HTML string after setting it', () => {
        render(<App />);
        fireEvent.click(screen.getByText(SET_GROSS_INCOME));
        fireEvent.click(screen.getByText(SET_MAX_LOAN));
        fireEvent.click(screen.getByText(SET_GEMINI_HTML));

        expect(screen.getByText(GEMINI_HTML_TITLE)).toBeInTheDocument();
        expect(screen.getByText(GEMINI_HTML_CONTENT)).toBeInTheDocument();
    });

    it('displays HTTP error message when error is triggered', () => {
        render(<App />);
        fireEvent.click(screen.getByText(SET_GROSS_INCOME));
        fireEvent.click(screen.getByText(SET_MAX_LOAN));
        fireEvent.click(screen.getByText(TRIGGER_HTTP_ERROR));

        expect(screen.getByText(HTTP_ERROR_MESSAGE)).toBeInTheDocument();
    });

    it('clears HTTP error when new Gemini HTML string is set', () => {
        render(<App />);
        fireEvent.click(screen.getByText(SET_GROSS_INCOME));
        fireEvent.click(screen.getByText(SET_MAX_LOAN));
        fireEvent.click(screen.getByText(TRIGGER_HTTP_ERROR));

        expect(screen.getByText(HTTP_ERROR_MESSAGE)).toBeInTheDocument();

        fireEvent.click(screen.getByText(SET_GEMINI_HTML));

        expect(screen.queryByText(HTTP_ERROR_MESSAGE)).toBeNull();
        expect(screen.getByText(GEMINI_HTML_TITLE)).toBeInTheDocument();
    });
});
