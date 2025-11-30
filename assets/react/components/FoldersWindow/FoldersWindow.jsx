import React, { useEffect } from 'react';
import useDriveStore from '../../stores/driveStore.js';

import './FoldersWindow.scss';

const FoldersWindow = (props) => {
  const { drive, driveIndex } = useDriveStore();

  return (
    <section id="folders-window" className="">

    </section>
  );
};
export default FoldersWindow;
