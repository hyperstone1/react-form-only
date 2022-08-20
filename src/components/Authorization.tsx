import { useState, useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { setUser } from '../store/slices/userSlice';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import './spinner.css';
import { IForm } from '../types/form.interface';
import { useAppDispatch } from '../hooks/redux-hooks';

const SpanReg = styled.span`
  font-weight: 500;
  font-size: 18px;
  color: #676a71;
  padding: 23px 94px 23px 62px;
  cursor: pointer;
  padding: 0px;

  border-radius: 5px;
`;

const Authorization = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isUserExist, setIsUserExist] = useState<boolean>(true);
  const [isChangeType, setIsChangeType] = useState<boolean>(true);
  const [isCorrectPass, setIsCorrectPass] = useState<boolean>(true);
  const refPass = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IForm>({
    mode: 'onChange',
  });
  const { ref } = register('password');

  useEffect(() => {
    const watchForm = watch(() => {
      setIsUserExist(true);
      setIsCorrectPass(true);
    });
    return () => watchForm.unsubscribe();
  }, []);

  const onSubmit: SubmitHandler<IForm> = (data) => {
    const auth = getAuth();
    console.log(`email: ${data.email}, password: ${data.password}`);
    signInWithEmailAndPassword(auth, data.email, data.password)
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
              title: 'Вы успешно вошли в аккаунт',
              timer: 1500,
              icon: 'success',
              showConfirmButton: false,
            });
            rememberMeHandler(data.email, data.password);
            setIsUserExist(true);
            reset();
            navigate('/');
          }, 2000);
        });
      })
      .catch((error) => {
        return new Promise(() => {
          setTimeout(() => {
            console.log(data.email, data.password);
            console.log(error.message);
            if (error.message.includes('user-not-found')) {
              setIsUserExist(false);
            } else if (
              !error.message.includes('user-not-found') &&
              error.message.includes('wrong-password')
            ) {
              setIsCorrectPass(false);
            }
            Swal.fire({
              icon: 'error',
              title: 'Упс...',
              text: 'Не получилось войти в аккаунт',
            });
            setEmail(data.email);
          }, 2000);
        });
      });
    return new Promise<string | void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2500);
    });
  };

  useEffect(() => {
    const emailStorage: string | null = localStorage.getItem('email');
    const passStorage: string | null = localStorage.getItem('password');
    if (emailStorage !== '' && passStorage !== '') {
      setValue('email', emailStorage ?? '');
      setValue('password', passStorage ?? '');
    }
  }, []);

  const onClickEyeNewPass = () => {
    const changeType = refPass.current;
    console.log(changeType);
    setIsChangeType(!isChangeType);
    if (null !== changeType) {
      isChangeType ? (changeType.type = 'text') : (changeType.type = 'password');
    }
  };

  const rememberMeHandler = (email: string, password: string) => {
    isChecked && localStorage.setItem('email', email);
    isChecked && localStorage.setItem('password', password);
  };

  return (
    <div className="form_block" style={{ height: '1000px' }}>
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isUserExist && <div className="errorSubmit">Пользователя {email} не существует.</div>}
        {!isCorrectPass && <div className="errorSubmit">Неверный пароль.</div>}
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
                value: /^[A-Za-z]{5,10}$/,
                message: 'Введите корректный пароль',
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

        <div className="check">
          <div className="checkboxBlock">
            <input
              onClick={() => setIsChecked(!isChecked)}
              type="checkbox"
              className="checkbox-round"
            />
          </div>
          <label htmlFor="">Запомнить пароль</label>
        </div>

        <button disabled={isSubmitting} className={isSubmitting ? 'submitting submit' : 'submit'}>
          {isSubmitting ? <span className="loader"></span> : 'Войти'}
        </button>

        <div className="register">
          <label htmlFor="">У вас нет аккаунта?</label>
          <Link to="/register">
            <SpanReg> Нажмите сюда, чтобы создать</SpanReg>
          </Link>
        </div>
      </form>
    </div>
  );
};
export default Authorization;
