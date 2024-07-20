import { useEffect, useRef, useState } from 'react';

// delay is in seconds
export const useSimplePolling = (
    callback: () => void | Promise<void>,
    delay: number = 6,
    maxCalls: number = 4,
    stopPollingCallback: () => void | Promise<void> = () => {}
) => {
    const savedCallback = useRef(callback);
    const [calls, setCalls] = useState<number>(0);
    const [isPolling, setIsPolling] = useState<boolean>(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!isPolling) return;

        const id = setInterval(() => {
            setCalls((prevCalls) => {
                if (prevCalls >= maxCalls) {
                    clearInterval(id);
                    setIsPolling(false);
                    stopPollingCallback();
                    return prevCalls;
                }
                savedCallback.current();
                return prevCalls + 1;
            });
        }, delay * 1000);

        setIntervalId(id);

        return () => {
            if (id) clearInterval(id);
        };
    }, [delay, isPolling, maxCalls, stopPollingCallback]);

    const startPolling = () => {
        setIsPolling(true);
    };

    const stopPolling = () => {
        if (intervalId) clearInterval(intervalId);
        setIsPolling(false);
        setCalls(0);
    };

    return {
        startPolling,
        stopPolling,
    };
};
