import React, { useState } from 'react';
import axios from 'axios';

const DebugLogin = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const testLogin = async () => {
        setResult(null);
        setError(null);

        try {
            console.log('Testing login to: http://localhost:5001/api/auth/login');

            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email: 'faculty@university.edu',
                password: 'faculty123',
                role: 'faculty'
            });

            console.log('Login response:', response.data);
            setResult(JSON.stringify(response.data, null, 2));
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || err.message);
        }
    };

    const testHealth = async () => {
        setResult(null);
        setError(null);

        try {
            const response = await axios.get('http://localhost:5001/api/health');
            console.log('Health check:', response.data);
            setResult(JSON.stringify(response.data, null, 2));
        } catch (err) {
            console.error('Health check error:', err);
            setError(err.message);
        }
    };

    const createFaculty = async () => {
        setResult(null);
        setError(null);

        try {
            const response = await axios.post('http://localhost:5001/api/auth/create-faculty');
            console.log('Create faculty response:', response.data);
            setResult(JSON.stringify(response.data, null, 2));
        } catch (err) {
            console.error('Create faculty error:', err);
            setError(err.response?.data?.error || err.message);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Debug Login Test</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={testHealth} style={{ marginRight: '10px', padding: '10px' }}>
                    Test Backend Health
                </button>
                <button onClick={createFaculty} style={{ marginRight: '10px', padding: '10px' }}>
                    Create Faculty Users
                </button>
                <button onClick={testLogin} style={{ padding: '10px' }}>
                    Test Faculty Login
                </button>
            </div>

            {result && (
                <div style={{ background: '#d4edda', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
                    <h3>Success:</h3>
                    <pre>{result}</pre>
                </div>
            )}

            {error && (
                <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
                    <h3>Error:</h3>
                    <pre>{error}</pre>
                </div>
            )}

            <div style={{ marginTop: '30px', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
                <h3>Test Credentials:</h3>
                <p><strong>Email:</strong> faculty@university.edu</p>
                <p><strong>Password:</strong> faculty123</p>
                <p><strong>Role:</strong> faculty</p>
            </div>
        </div>
    );
};

export default DebugLogin;
