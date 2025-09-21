import React, { useState, useEffect, useRef } from 'react';
import RoutesWrapper from './route/RoutesWrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from './components/loader/Loader';
import { ToastContainer, toast } from 'react-toastify';
import useUserStore, { getUser } from './stores/userStore.js';

function App() {
    const navigate = useNavigate();
    const reactLocation = useLocation();
    const [canQuery, setCanQuery] = useState(false);
    const { fetch: originalFetch } = window;
    const [loader, setLoader] = useState(false);
    const { user } = useUserStore();

    useEffect(() => {
        window.fetch = async (...args) => {
            setLoader(true);

            const [url, options = {}] = args;
            if (options.method.toLowerCase() === 'patch') {
                options.headers['Content-Type'] = 'application/merge-patch+json';
            }
            const response = await originalFetch.apply(this, [url, options]);

            setLoader(false);
    
            const clonedResponse = response.clone();
            if (clonedResponse.ok === false) {
                let msg = '';
                const jsonResponse = await clonedResponse.json();
                if (jsonResponse.message) msg += jsonResponse.message + ' ';
                if (jsonResponse.violations) {
                    for (let entry of jsonResponse.violations) {
                    msg += `${entry['propertyPath']} : ${entry['message']} `;
                    }
                }
                if (jsonResponse['hydra:description']) msg += jsonResponse['hydra:description'] + ' ';
                toast.error(msg, {
                    autoClose: 5000,
                    theme: "light",
                });

                if (clonedResponse.status === 401 && reactLocation.pathname !== '/')navigate('/');
            } else if (options.method.toLowerCase() !== 'get') {
                toast.success('Envoyé', {
                    autoClose: 300,
                    theme: "light",
                });
            }
            
            return response;
        };
        setCanQuery(true);

        if (user === null && localStorage.getItem('token') !== null) {
          getUser();
        }
      }, []);

    return(
        <>
            <RoutesWrapper canQuery={canQuery} />
            {loader && <Loader />}

            <ToastContainer
                position="top-right"
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}
export default App;