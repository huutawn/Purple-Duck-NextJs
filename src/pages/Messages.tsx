import React, { useState } from 'react';
import { Send, Search, Users, MessageCircle, Phone, Video } from 'lucide-react';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const chats = [
    {
      id: '1',
      name: 'Electronics Store',
      lastMessage: 'Thank you for your order! Your package will be shipped soon.',
      time: '2:30 PM',
      unread: 2,
      avatar: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      type: 'seller'
    },
    {
      id: '2',
      name: 'John Doe',
      lastMessage: 'Is this product still available?',
      time: '1:15 PM',
      unread: 0,
      avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      type: 'buyer'
    },
    {
      id: '3',
      name: 'Fashion Boutique',
      lastMessage: 'Your return has been processed successfully.',
      time: '11:45 AM',
      unread: 1,
      avatar: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      type: 'seller'
    },
  ];

  const messages = [
    {
      id: '1',
      content: 'Hello! I have a question about the Premium Wireless Headphones.',
      sender: 'user',
      time: '2:25 PM',
    },
    {
      id: '2',
      content: 'Hi! I\'d be happy to help. What would you like to know?',
      sender: 'other',
      time: '2:26 PM',
    },
    {
      id: '3',
      content: 'What\'s the battery life like?',
      sender: 'user',
      time: '2:27 PM',
    },
    {
      id: '4',
      content: 'The battery lasts up to 30 hours with ANC off, and 20 hours with ANC on. It also supports quick charging - 15 minutes gives you 3 hours of playback.',
      sender: 'other',
      time: '2:28 PM',
    },
    {
      id: '5',
      content: 'That sounds great! I\'ll take it.',
      sender: 'user',
      time: '2:29 PM',
    },
    {
      id: '6',
      content: 'Thank you for your order! Your package will be shipped soon.',
      sender: 'other',
      time: '2:30 PM',
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedChat === chat.id ? 'bg-purple-50 border-purple-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {chat.type === 'seller' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500">{chat.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">{chat.unread}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={chats.find(c => c.id === selectedChat)?.avatar}
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {chats.find(c => c.id === selectedChat)?.name}
                          </h3>
                          <p className="text-sm text-green-600">Online</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-gray-100">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-gray-100">
                          <Video className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}