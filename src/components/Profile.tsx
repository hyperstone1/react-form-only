import React from 'react';
import { removeUser } from '../store/slices/userSlice';
import { useAuth } from '../hooks/use-auth';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const { isAuth, email } = useAuth();

  return isAuth ? (
    <div
      style={{
        position: 'relative',
        marginTop: '20%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <h2>
        Здравствуйте <b>{email}</b>
      </h2>
      <button
        onClick={() => dispatch(removeUser())}
        style={{
          background: '#F5F5F5',
          borderRadius: '8px',
          padding: '19px 71px',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '18px',
        }}>
        Выйти
      </button>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Profile;
