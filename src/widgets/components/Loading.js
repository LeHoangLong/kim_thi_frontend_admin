import React from 'react';
import './spinkit.min.css'

export const Loading = ({ height = '100vh' } = {}) => {
    return (
        <div className="loading" style={{ height: height }}>
            <div className="sk-chase">
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
            </div>
        </div>
    )
}

export default Loading;
