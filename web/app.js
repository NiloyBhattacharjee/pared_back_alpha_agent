const views = {
  login: document.getElementById('login'),
  chat: document.getElementById('chat'),
  profile: document.getElementById('profile'),
};

const chatListEl = document.getElementById('chat-list');
const messageListEl = document.getElementById('message-list');
const chatNameEl = document.getElementById('chat-name');
const chatStatusEl = document.getElementById('chat-status');

const chats = [
  {
    id: 'general',
    name: 'General Chat',
    status: 'Active now',
    preview: 'Hey, how can I help?',
    messages: [
      { from: 'them', text: 'Hey, how can I help?', time: '11:00' },
      { from: 'you', text: 'Hello!', time: '10:45' },
    ],
  },
  {
    id: 'team',
    name: 'Team Support',
    status: '2 new replies',
    preview: 'Project Alpha deploy is green ✅',
    messages: [
      { from: 'them', text: 'Project Alpha deploy is green ✅', time: '10:10' },
    ],
  },
  {
    id: 'alpha',
    name: 'Project Alpha',
    status: 'Away',
    preview: 'Meeting at 1pm?',
    messages: [
      { from: 'them', text: 'Meeting at 1pm?', time: '09:30' },
    ],
  },
];

let activeChat = chats[0];

function switchView(target) {
  Object.values(views).forEach((view) => view.classList.remove('active'));
  views[target].classList.add('active');
}

function renderChats() {
  chatListEl.innerHTML = '';
  chats.forEach((chat) => {
    const item = document.createElement('button');
    item.className = `chat-item ${chat.id === activeChat.id ? 'active' : ''}`;
    item.innerHTML = `
      <div class="avatar">${chat.name[0]}${chat.name[1] || ''}</div>
      <div class="chat-meta">
        <div class="name">${chat.name}</div>
        <div class="preview">${chat.preview}</div>
      </div>
      <div class="status ${chat.status.includes('Active') ? 'online' : ''}">${chat.status}</div>
    `;
    item.addEventListener('click', () => {
      activeChat = chat;
      renderChats();
      renderMessages();
    });
    chatListEl.appendChild(item);
  });
}

function renderMessages() {
  chatNameEl.textContent = activeChat.name;
  chatStatusEl.textContent = activeChat.status;
  messageListEl.innerHTML = '';
  activeChat.messages.slice().reverse().forEach((msg) => {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${msg.from}`;
    bubble.innerHTML = `<div>${msg.text}</div><div class="timestamp">${msg.time}</div>`;
    messageListEl.appendChild(bubble);
  });
  messageListEl.scrollTop = messageListEl.scrollHeight;
}

function addMessage(text) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  activeChat.messages.push({ from: 'you', text, time });
  activeChat.preview = text;
  activeChat.status = 'Active now';
  renderChats();
  renderMessages();
}

// Event wiring
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  switchView('chat');
  renderChats();
  renderMessages();
});

const messageForm = document.getElementById('message-form');
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.getElementById('message-text').value.trim();
  if (!text) return;
  document.getElementById('message-text').value = '';
  addMessage(text);
});

// Profile interactions
const profileForm = document.getElementById('profile-form');
profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('profile-name').value.trim();
  const status = document.getElementById('profile-status').value;
  const about = document.getElementById('profile-about').value;
  document.querySelector('.user-block .name').textContent = name || 'You';
  document.querySelector('.user-block .status').textContent = status;
  document.querySelector('.user-block .avatar').textContent = name.slice(0, 2) || 'YY';
  document.querySelector('.profile-header .name').textContent = name || 'You';
  document.querySelector('.profile-header .status').textContent = status;
  document.querySelector('.profile-header .avatar').textContent = name.slice(0, 2) || 'YY';
  localStorage.setItem('profile', JSON.stringify({ name, status, about }));
  switchView('chat');
});

document.getElementById('cancel-profile').addEventListener('click', () => switchView('chat'));
document.getElementById('back-to-chat').addEventListener('click', () => switchView('chat'));
document.getElementById('open-profile').addEventListener('click', () => switchView('profile'));

document.getElementById('back-button').addEventListener('click', () => switchView('chat'));

document.getElementById('change-photo').addEventListener('click', () => {
  alert('Photo upload is stubbed in this prototype.');
});

document.getElementById('forgot').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Password reset flow is stubbed in this prototype.');
});

// Restore saved profile if available
const savedProfile = localStorage.getItem('profile');
if (savedProfile) {
  const { name, status, about } = JSON.parse(savedProfile);
  document.getElementById('profile-name').value = name;
  document.getElementById('profile-status').value = status;
  document.getElementById('profile-about').value = about;
}

renderChats();
renderMessages();
