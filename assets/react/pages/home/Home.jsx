import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './Home.scss';
import useUserStore, { getAuth } from '../../stores/userStore.js';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [passwordInputType, setPasswordInputType] = useState('password');

  useEffect(() => {
    reset({
      email: null,
      password: null,
    });
  }, []);

  useEffect(() => {
    if (user) navigate('/mon-drive');
  }, [user]);

  const onSubmit = async (data) => {
    await getAuth(data);
  };

  return (
    <>
      <section id="home" className="w-100 vh-100 p-2 d-flex justify-content-center align-items-center bg-[#f7f9fb]">
        <form className="w-100 max-w-[400px] p-4 bg-white rounded" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <img src="/static/icons8-google-drive-512.png" alt="" />
          </div>
          <h2 className="text-center">Connectez-vous</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              autoComplete="off"
              {...register('email', {
                required: { value: true, message: 'Le champ est obligatoire' },
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
            />
            {errors.email?.type === 'required' && (
              <div className="alert alert-danger mt-1">{errors.email?.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type={passwordInputType}
              id="password"
              name="password"
              className="form-control"
              autoComplete="off"
              {...register('password', { required: { value: true, message: 'Le champ est obligatoire' } })}
            />
            {errors.password?.type === 'required' && (
              <div className="alert alert-danger mt-1">{errors.password.message}</div>
            )}
          </div>
          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="check-password-input-type"
                onChange={(e) => (e.target.checked ? setPasswordInputType('text') : setPasswordInputType('password'))}
              />
              <label className="form-check-label" htmlFor="check-password-input-type">
                Afficher le mot de pass
              </label>
            </div>
          </div>
          <div className="mb-3">Mot de passe oublié</div>
          <div className="d-grid gap-2">
            <button className="btn btn-primary" type="submit">
              Envoyer
            </button>
          </div>
        </form>
      </section>
    </>
  );
};
export default Home;
