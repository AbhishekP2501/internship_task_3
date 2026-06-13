import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../../services/api';
import './Auth.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await verifyEmail(token);
        setMessage(data.message);
        setStatus('success');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-page" style={{ paddingTop: '100px' }}>
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            {status === 'loading' ? '⏳' : status === 'success' ? '✅' : '❌'}
          </div>
          <h1>{status === 'loading' ? 'Verifying...' : status === 'success' ? 'Email Verified!' : 'Verification Failed'}</h1>
        </div>
        {status !== 'loading' && (
          <>
            <div className={`auth-message ${status}`}>{message}</div>
            <div className="auth-links">
              <Link to="/login">Go to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
