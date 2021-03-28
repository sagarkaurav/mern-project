import {useState, useCallback, useRef, useEffect} from 'react';

export const useBackendApi = () => {
    const [isLoading, setisLoading] = useState(false);
    const [err, setError] = useState('');
    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method= 'GET', body=null, headers = {}) => {
        try {
            setisLoading(true);
            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);
            const resp = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });
            const respData = await resp.json(); 
            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);
            if(!resp.ok) {
                throw new Error(respData.message);
            }
            setisLoading(false);
            return respData;
        }catch(err) {
            setError(err.message);
            setisLoading(false);
            throw err;
        }
    }, []);
    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, [])
    return {isLoading, err, sendRequest}
};