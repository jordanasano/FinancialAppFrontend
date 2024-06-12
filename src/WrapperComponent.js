import React from 'react';
import './WrapperComponent.css';
function WrapperComponent({ children }) {
    return (
        <div className="container-fluid bg-secondary bg-opacity-50 wrapper-body">
            {children}
        </div>
    );
}

export default WrapperComponent;