import React from 'react';
import Layout from '../components/Layout';
import ChatRoom from '../components/ChatRoom';

const Chat = () => {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8 w-full">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Traders Hub</h1>
                    <p className="text-slate-400">Join the conversation with other top traders.</p>
                </div>
                <ChatRoom />
            </div>
        </Layout>
    );
};

export default Chat;
