import React, { useEffect, useRef, useState } from 'react';
import {
  getGlobalMessages,
  sendMessage,
  getCurrentUserId,
  getPrivateMessages
} from '../services/api';
import './ChatPage.css';
import { API_BASE } from '../services/api';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [selectedTarget, setSelectedTarget] = useState('global');
  const [users, setUsers] = useState([]);

  const currentUserId = getCurrentUserId();

  const loadMessages = async () => {
    try {
      if (selectedTarget === 'global') {
        const globalMsgs = await getGlobalMessages();
        setMessages(globalMsgs);
      } else {
        const privateMsgs = await getPrivateMessages(currentUserId, parseInt(selectedTarget));
        setMessages(privateMsgs);
      }
    } catch (err) {
      console.error('Eroare la încărcarea mesajelor:', err);
    }
  };

  const capitalize = (name) => {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    loadMessages();
  }, [selectedTarget]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Eroare la încărcarea utilizatorilor:', err);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const senderId = currentUserId;
    if (!newMessage.trim() || !senderId) return;

    const isPrivate = selectedTarget !== 'global';
    const parsedReceiverId = parseInt(selectedTarget);
    const receiverId = isPrivate && !isNaN(parsedReceiverId) ? parsedReceiverId : null;

    const payload = {
      senderId,
      content: newMessage.trim(),
      ...(receiverId && { receiverId })
    };

    console.log("Trimitem mesaj:", payload);

    try {
      await sendMessage(payload);
      setNewMessage('');
      loadMessages();
    } catch (err) {
      console.error("Eroare la trimiterea mesajului:", err);
      alert('Eroare la trimiterea mesajului');
    }
  };

  return (
  <div className="chat-container">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 className="chat-title">
        {selectedTarget === 'global' ? 'Chat Global' : 'Chat Privat'}
      </h2>
      <select
        value={selectedTarget}
        onChange={(e) => setSelectedTarget(e.target.value)}
        style={{
          padding: '5px 10px',
          fontSize: '0.9rem',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      >
        <option value="global">🌐 Chat Global</option>
        {users
          .filter((u) => u.Id !== currentUserId)
          .map((u) => (
            <option key={u.Id} value={u.Id}>
              👤 {u.Email?.split('@')[0]?.charAt(0).toUpperCase() + u.Email?.split('@')[0]?.slice(1)}
            </option>
          ))}
      </select>
    </div>

    <div className="chat-messages">
      {messages.length === 0 ? (
        <p className="empty-chat">Nu există mesaje în acest chat.</p>
      ) : (
        messages.map((msg, idx) => {
          let senderName;
          let senderRole;

          if (msg.SenderName && msg.SenderRole !== undefined) {
            // Chat global - datele vin direct din backend
            senderName = msg.SenderName;
            senderRole = msg.SenderRole;
          } else {
            // Chat privat - extragem datele din lista de users
            const senderUser = users.find(
              (u) => u.Id === msg.senderId || u.Id === msg.SenderId
            );
            senderName = senderUser?.Email?.split('@')[0] ?? `User ${msg.senderId || msg.SenderId}`;
            senderRole = senderUser?.Role;
          }

          return (
            <div key={idx} className="chat-message">
              <strong>
                {senderRole === '1'
                  ? `Dr. ${capitalize(senderName)}`
                  : capitalize(senderName)}
                :
              </strong>{' '}
              {msg.content ?? msg.Content ?? '(mesaj indisponibil)'}
              <div className="chat-timestamp">
                {formatDate(msg.SentAt || msg.sentAt)}
              </div>
            </div>
          );
        })
      )}
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
