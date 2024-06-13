import React from 'react';
import './WrapperComponent.css';
function WrapperComponent({ children }) {
    return (
        <div className="container-fluid wrapper-body">
            {children}
        </div>
    );
}

export default WrapperComponent;