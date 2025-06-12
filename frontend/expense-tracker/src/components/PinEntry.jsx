import React, { useState, useEffect, useRef } from 'react';
import './css/pinentry.css';

const correctPin = '1234'; // define pin 
function PinEntry() {
    const [currentPin, setCurrentPin] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const messageTimeoutRef = useRef(null);
    const showMessage = (text, type) => {
        setMessage({ text, type });
        if (messageTimeoutRef.current) {
            clearTimeout(messageTimeoutRef.current);
        }
        messageTimeoutRef.current = setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 3000);
    };

    const clearPin = () => {
        setCurrentPin('');
        setMessage({ text: '', type: '' });
    };

    const verifyPin = () => {
        if (currentPin.length !== 4) {
            showMessage('Please enter a 4-digit PIN', 'error');
            return;
        }

        if (currentPin === correctPin) {
            showMessage('PIN correct! Access granted.', 'success');
            setTimeout(() => {

                window.location.href = 'dashboard';
            }, 1500);
        } else {
            showMessage('Incorrect PIN. Please try again.', 'error');
            setTimeout(() => {
                clearPin();
            }, 1000);
        }
    };

    const handleKeyPress = (value) => {
        setMessage({ text: '', type: '' });

        if (value === 'clear') {
            clearPin();
        } else if (value === 'enter') {
            verifyPin();
        } else if (currentPin.length < 4) {
            setCurrentPin(prevPin => prevPin + value);
        }
    };


    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key;

            if (!isNaN(parseInt(key)) && parseInt(key) >= 0 && parseInt(key) <= 9) {
                handleKeyPress(key);
            } else if (key === 'Enter') {
                handleKeyPress('enter');
            } else if (key === 'Backspace' || key === 'Delete') {
                handleKeyPress('clear');
            }
        };

        document.addEventListener('keydown', handleKeyDown);


        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
        };
    }, [currentPin]);

    return (
        <div className="pin-body">
            <div className="pin-wrapper">
                <h1 className='request'>Enter PIN</h1>
                <p>Please enter your 4-digit PIN code</p>

                <div className="pin-display">
                    {[0, 1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className={`pin-digit ${index < currentPin.length ? 'filled' : ''}`}
                        >
                            {index < currentPin.length ? '*' : ''}
                        </div>
                    ))}
                </div>

                <div className="keypad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            className="key"
                            onClick={() => handleKeyPress(num.toString())}
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        className="key"
                        onClick={() => handleKeyPress('clear')}
                    >
                        Clear
                    </button>
                    <button
                        className="key"
                        onClick={() => handleKeyPress('0')}
                    >
                        0
                    </button>
                    <button
                        className="key "
                        onClick={() => handleKeyPress('enter')}
                    >
                        Enter
                    </button>
                </div>

                <div className={`message ${message.type}`} >
                    {message.text}
                </div>
            </div>
        </div>
    );
}

export default PinEntry;