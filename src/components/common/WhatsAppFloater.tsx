import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppFloater: React.FC = () => {
    const { adminSettings } = useStore();
    const groupUrl = adminSettings?.marketing?.whatsappGroupUrl;

    if (!groupUrl) return null;

    return (
        <AnimatePresence>
            <motion.a
                href={groupUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow group"
                title="Join our Community"
            >
                <MessageCircle className="h-6 w-6 fill-current" />
                <span className="absolute right-full mr-3 bg-foreground text-background text-xs font-medium px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Join Community
                </span>
            </motion.a>
        </AnimatePresence>
    );
};

export default WhatsAppFloater;
