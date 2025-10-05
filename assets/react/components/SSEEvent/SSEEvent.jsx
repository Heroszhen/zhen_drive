import { useEffect, useState, memo } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { wait } from '../../services/util';
import { getRequestHeaders } from '../../services/data';
import { ToastContainer, toast } from 'react-toastify';

const SSEEvent = ({ url, payload, traitResponse }) => {
  const [ctrl, setCtrl] = useState(new AbortController());
  const [canBeCancelled, setCanBeCancelled] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeunload', abortController);

    (async () => {
      await abortController();
      if (url) startStream();
    })();

    return async () => {
      await abortController();
      window.removeEventListener('beforeunload', abortController);
    };
  }, [url]);

  const startStream = async () => {
    setCanBeCancelled(true);

    await fetchEventSource(url, {
      method: 'GET',
      headers: getRequestHeaders(),
      signal: ctrl.signal,
      onmessage(e) {
        if (e.event === 'new_event' && e.data !== '') {
          const data = JSON.parse(e.data);
          toast.success(data.type, {
            autoClose: 3000,
            theme: 'light',
            containerId: 'toast-sse',
          });
        }
      },
      onerror(err) {
        console.log(err);
      },
    });
  };

  const abortController = async () => {
    if (canBeCancelled) {
      ctrl.abort();
      await wait(0.5);
      setCtrl(new AbortController());
      setCanBeCancelled(true);
      await wait(0.5);
    }
  };

  return (
    <>
      <ToastContainer
        containerId="toast-sse"
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
  );
};
export default memo(SSEEvent);
