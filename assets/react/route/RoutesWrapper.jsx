import { Routes, Route } from 'react-router-dom';
import LoginGuard from './LoginGuard.jsx';
import AdminGuard from './AdminGuard.jsx';

import Home from '../pages/Home/Home.jsx';
import Drive from '../pages/Drive/Drive.jsx';

const RoutesWrapper = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {props.canQuery && (
          <>
            <Route element={<LoginGuard />}>
              <Route path="/mon-drive" element={<Drive />} />
            </Route>

            <Route element={<AdminGuard />}></Route>
          </>
        )}
      </Routes>
    </>
  );
};
export default RoutesWrapper;
