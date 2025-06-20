import React, { useEffect, useRef, useState } from 'react';
import { fetchGlobalMessages, sendGlobalMessage } from '../services/api';
import { getCurrentUserId } from '../services/api';

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
    <div>
      <h2>Chat Global</h2>

      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem' }}>
            <strong>{msg.SenderName || msg.senderName || 'Anonim'}:</strong>{' '}
            {msg.content ?? msg.Content ?? '(mesaj indisponibil)'}
            <div style={{ fontSize: '0.75rem', color: '#666' }}>
              {formatDate(msg.SentAt || msg.sentAt)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Scrie un mesaj..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ width: '80%' }}
        />
        <button type="submit" style={{ width: '18%', marginLeft: '2%' }}>
          Trimite
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
