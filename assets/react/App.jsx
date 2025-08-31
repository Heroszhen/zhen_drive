import React, { useState, useEffect, useRef } from 'react';
import RoutesWrapper from './route/RoutesWrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from './components/loader/Loader';

function App() {
    const navigate = useNavigate();
    const reactLocation = useLocation();
    const [canQuery, setCanQuery] = useState(false);
    const { fetch: originalFetch } = window;
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        window.fetch = async (...args) => {
            setLoader(true);

            const [url, options = {}] = args;
            if (options.method.toLowerCase() === 'patch') {
                options.headers['Content-Type'] = 'application/merge-patch+json';
            }
            const response = await originalFetch.apply(this, [url, options]);
    
            const clonedResponse = response.clone();
            if (clonedResponse.ok === false) {
                try {
                    const jsonResponse = await clonedResponse.json();
                    let msg = '';
                    if (jsonResponse.message) msg += jsonResponse.message + '<br>';
                    if (jsonResponse.violations) {
                        for (let entry of jsonResponse.violations) {
                        msg += `${entry['propertyPath']} : ${entry['message']}<br>`;
                        }
                    }
                    if (jsonResponse['hydra:description']) msg += jsonResponse['hydra:description'] + '<br>';
                } catch (e) {
                    console.error('Error occurred:', e); // Log the error
                } finally {
                    if (clonedResponse.status === 401 && reactLocation.pathname !== '/')navigate('/');
                }
            }

            setLoader(false);
            return response;
        };
        setCanQuery(true);
    /*
        if (user === null && localStorage.getItem('token') !== null) {
          getUser();
        }*/
      }, []);

    return(
        <>
            <RoutesWrapper canQuery={canQuery} />
            {loader && <Loader />}
        </>
    )
}
export default App;