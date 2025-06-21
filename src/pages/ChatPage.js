import React, { useEffect, useRef, useState } from 'react';
import { fetchGlobalMessages, sendGlobalMessage, getCurrentUserId } from '../services/api';
import './ChatPage.css';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const loadMessages = async () => {
    try {
      const data = await fetchGlobalMessages();
      setMessages(data);
    } catch (err) {
      console.error('Eroare la încărcarea mesajelor:', err);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const senderId = getCurrentUserId();
    if (!newMessage.trim() || !senderId) return;

    try {
      await sendGlobalMessage({
        senderId,
        content: newMessage.trim(),
      });
      setNewMessage('');
      loadMessages();
    } catch (err) {
      alert('Eroare la trimiterea mesajului');
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">Chat Global</h2>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            <strong>{msg.SenderName || msg.senderName || 'Anonim'}:</strong>{' '}
            {msg.content ?? msg.Content ?? '(mesaj indisponibil)'}
            <div className="chat-timestamp">
              {formatDate(msg.SentAt || msg.sentAt)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          placeholder="Scrie un mesaj..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-button">
          Trimite
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
