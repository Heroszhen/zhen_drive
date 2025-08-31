import { Routes, Route } from 'react-router-dom';
import LoginGuard from './LoginGuard.jsx';
import AdminGuard from './AdminGuard.jsx';

import Home from '../pages/home/Home.jsx';


const RoutesWrapper = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {props.canQuery && (
          <>
            <Route element={<LoginGuard />}>
              
            </Route>

            <Route element={<AdminGuard />}>
            
            </Route>
          </>
        )}
      </Routes>
    </>
  );
};
export default RoutesWrapper;