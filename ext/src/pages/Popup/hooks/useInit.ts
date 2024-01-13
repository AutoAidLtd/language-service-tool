import React, { useEffect, useState } from 'react';
import { doFetch, getRemoteURI } from '../util';

const useInit = () => {
  const [types, setTypes] = useState<any>();
  const [url, setUrl] = useState<string | null>(() => getRemoteURI());
  useEffect(() => {
    var remoteUrl: string | null = localStorage.getItem("remoteUrl");
    while (!remoteUrl) {
      remoteUrl = window.prompt(
        'Enter remote URL: ',
        'http://localhost:5551/api/language'
      );
    }
    if (remoteUrl) {
      localStorage.setItem('remoteUrl', remoteUrl);
      setUrl(remoteUrl);
    }
  }, [url]);
  useEffect(() => {
    if (url) {
      doFetch('/types', {
        method: 'get',
      }).then((data) => {
        setTypes(data.data);
      });
    }
  }, [url]);
  return { types };
};

export default useInit;
