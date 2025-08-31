import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

//login
const Home = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    return (
        <>
            <section id="home" className="w-100 vh-100 d-flex justify-content-center align-items-center bg-color-f7f9fb">
                <form className="w-[120px]">
                    <div>

                    </div>
                </form>
            </section>
        </>
    );
}
export default Home;