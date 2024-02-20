import React, { useState } from 'react';
import { verifyEmailCode } from '../../api/api'; // This should be an API function that calls your backend's verifyEmail endpoint

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyEmailCode({ email, verificationCode: code });
      alert('Email verified successfully!');
      // Redirect the user or update the UI as needed
    } catch (error) {
      setErrorMessage('Failed to verify email. Please check the code and try again.');
      console.error('Error verifying email:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Verification Code"
          required
        />
        <button type="submit">Verify Email</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default EmailVerification;
