'use client';

import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error' | 'warning';
    title?: string;
    message: string;
    actionLabel?: string;
    actions?: Array<{
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'text';
    }>;
}

export default function NotificationModal({
    isOpen,
    onClose,
    type,
    title,
    message,
    actionLabel = 'Đóng',
    actions
}: NotificationModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for exit animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted || (!isOpen && !isVisible)) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={1.5} />;
            case 'error':
                return <XCircle className="w-12 h-12 text-red-500" strokeWidth={1.5} />;
            case 'warning':
                return <AlertCircle className="w-12 h-12 text-amber-500" strokeWidth={1.5} />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success':
                return { bg: 'bg-green-50', border: 'border-green-100', btn: 'bg-green-600 hover:bg-green-700 focus:ring-green-500' };
            case 'error':
                return { bg: 'bg-red-50', border: 'border-red-100', btn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500' };
            case 'warning':
                return { bg: 'bg-amber-50', border: 'border-amber-100', btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' };
        }
    };

    const colors = getColors();

    const portalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 mb-20 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            style={{ opacity: isOpen ? 1 : 0 }}>
            <div
                className={`bg-white rounded-2xl shadow-2xl max-w-sm w-full transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'} overflow-hidden`}
                role="dialog"
                aria-modal="true"
            >
                <div className="p-6 text-center">
                    <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full ${colors.bg} mb-5`}>
                        {getIcon()}
                    </div>
                    {title && (
                        <h3 className="text-xl font-black text-slate-900 mb-2">
                            {title}
                        </h3>
                    )}
                    <div className="mt-2">
                        <p className="text-sm text-slate-600 whitespace-pre-line font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>
                <div className="bg-slate-50 px-4 py-4 sm:px-6 border-t border-slate-100">
                    {actions && actions.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {actions.map((action, index) => {
                                const isPrimary = action.variant === 'primary' || (!action.variant && index === 0);
                                const isSecondary = action.variant === 'secondary';
                                const isText = action.variant === 'text';

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`w-full inline-flex justify-center rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-all active:scale-[0.98] ${isPrimary
                                                ? `border border-transparent shadow-sm text-white ${colors.btn}`
                                                : isSecondary
                                                    ? 'border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500'
                                                    : 'border-0 bg-transparent text-amber-600 hover:text-amber-700 underline'
                                            }`}
                                        onClick={() => {
                                            action.onClick();
                                            onClose();
                                        }}
                                    >
                                        {action.label}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className={`w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${colors.btn} transition-all active:scale-[0.98]`}
                            onClick={onClose}
                        >
                            {actionLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(portalContent, document.body);
}
