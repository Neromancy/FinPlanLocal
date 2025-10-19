import React from 'react';
import { useLoading } from '../../contexts/LoadingContext.tsx';

const Spinner: React.FC = () => (
    <div className="w-12 h-12 border-4 border-t-primary border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
);

const LoadingOverlay: React.FC = () => {
    const { loadingMessage } = useLoading();

    if (!loadingMessage) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 z-[100] flex flex-col justify-center items-center">
            <Spinner />
            <p className="mt-4 text-white text-lg font-semibold">{loadingMessage}</p>
        </div>
    );
};

export default LoadingOverlay;