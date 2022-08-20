import { useState, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { setUser } from '../store/slices/userSlice';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import './spinner.css';
import { IForm } from '../types/form.interface';
import { useAppDispatch } from '../hooks/redux-hooks';

const SpanReg = styled.h2`
  padding: 23px 94px 23px 62px;
  margintop: 170px;
  font-weight: 500;
  font-size: 18px;
  color: #676a71;
  cursor: pointer;

  border-radius: 5px;
`;
const ErrorMess = styled.p``;

const Authorization = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isChangeType, setIsChangeType] = useState(true);
  const [isUserExist, setIsUserExist] = useState(false);

  const refPass = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IForm>({
    mode: 'onChange',
  });
  const { ref } = register('password');

  const onSubmit: SubmitHandler<IForm> = (data) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(({ user }) => {
        console.log(user);
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.refreshToken,
          }),
        );
        return new Promise(() => {
          setTimeout(() => {
            Swal.fire({
              title: 'Вы успешно зарегистрировались и вошли в аккаунт!',
              timer: 1500,
              icon: 'success',
              showConfirmButton: false,
            });
            reset();
            navigate('/');
          }, 2000);
        });
      })
      .catch(() => {
        return new Promise(() => {
          setTimeout(() => {
            setIsUserExist(true);
            Swal.fire({
              icon: 'error',
              title: 'Упс...',
              text: 'Произошла ошибка при регистрации аккаунта!',
            });
          }, 2000);
        });
      });
    return new Promise<string | void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2500);
    });
  };

  const onClickEyeNewPass = () => {
    const changeType = refPass.current;
    setIsChangeType(!isChangeType);
    if (null !== changeType) {
      isChangeType ? (changeType.type = 'text') : (changeType.type = 'password');
    }
  };

  return (
    <div className="container">
      <Link to="/login">
        <SpanReg>Вернуться к авторизации</SpanReg>
      </Link>

      <div className="form_block" style={{ height: '700px' }}>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {isUserExist && (
            <div className="errorSubmit">Пользователь с этим email-ом уже зарегистрирован.</div>
          )}
          <div className="containerInput">
            <input
              {...register('email', {
                required: 'Обязательное поле',
                pattern: {
                  value: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
                  message: 'Пожалуйста введите корректный email',
                },
              })}
              className={errors.email && 'errorInput'}
            />
            <label htmlFor="">Логин</label>
          </div>
          {errors?.email && <p className="error">{errors.email.message}</p>}

          <div className="pass">
            <input
              {...register('password', {
                required: 'Обязательное поле',
                pattern: {
                  value: /^[A-Za-z0-9]{5,10}$/,
                  message: 'Пароль должен содержать 5-10 символов',
                },
              })}
              className={errors.password && 'errorInput'}
              type="password"
              ref={(e) => {
                ref(e);
                refPass.current = e;
              }}
            />

            <img
              onClick={onClickEyeNewPass}
              className="eye"
              src="../images/closedEye.svg"
              alt="closed-eye"
            />
            <label htmlFor="">Пароль</label>
          </div>
          {errors?.password && <p className="error">{errors.password.message}</p>}

          <button
            style={{ marginTop: '30px' }}
            disabled={isSubmitting}
            className={isSubmitting ? 'submitting submit' : 'submit'}>
            {isSubmitting ? <span className="loader"></span> : 'Зарегистироваться'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Authorization;
