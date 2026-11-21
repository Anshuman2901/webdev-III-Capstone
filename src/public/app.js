// CollabFlow Frontend Application
// Student: Anshuman Jha | Roll No: 2501010110

const API_BASE = '/api/v1';

// Application State
const state = {
  user: null,
  accessToken: localStorage.getItem('collab_access_token') || null,
  refreshToken: localStorage.getItem('collab_refresh_token') || null,
  projects: [],
  tasks: [],
  currentPage: 1,
  socket: null,
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  setupAuthModal();
  setupTaskModal();
  setupFilters();
  setupChat();
  setupSocket();

  // If token exists, load user profile
  if (state.accessToken) {
    await fetchCurrentUser();
  }

  loadProjects();
  loadTasks();
  loadAnalytics();
});

// Setup Navigation Tabs
function setupTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab') + 'Section';
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add('active');

      if (tab.getAttribute('data-tab') === 'analytics') {
        loadAnalytics();
      }
    });
  });
}

// Authenticated Fetch Wrapper with Automatic Refresh Token handling
async function authFetch(url, options = {}) {
  options.headers = options.headers || {};
  if (state.accessToken) {
    options.headers['Authorization'] = `Bearer ${state.accessToken}`;
  }
  options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';

  let res = await fetch(url, options);

  // If unauthorized and we have a refresh token, try refreshing
  if (res.status === 401 && state.refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      options.headers['Authorization'] = `Bearer ${state.accessToken}`;
      res = await fetch(url, options);
    }
  }

  return res;
}

// Refresh JWT Access Token
async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: state.refreshToken }),
    });

    if (res.ok) {
      const data = await res.json();
      state.accessToken = data.data.accessToken;
      localStorage.setItem('collab_access_token', state.accessToken);
      return true;
    } else {
      logout();
      return false;
    }
  } catch (err) {
    console.error('Failed to refresh token:', err);
    logout();
    return false;
  }
}

// Fetch Current Profile
async function fetchCurrentUser() {
  try {
    const res = await authFetch(`${API_BASE}/auth/me`);
    if (res.ok) {
      const data = await res.json();
      state.user = data.data.user;
      renderUserSession();
    } else {
      logout();
    }
  } catch (err) {
    console.error('Fetch user error:', err);
  }
}

// Render User Session UI
function renderUserSession() {
  const roleEl = document.getElementById('currentUserRole');
  const nameEl = document.getElementById('currentUserName');
  const btnEl = document.getElementById('authActionBtn');

  if (state.user) {
    roleEl.textContent = state.user.role.toUpperCase();
    roleEl.className = `role-badge ${state.user.role}`;
    nameEl.textContent = state.user.name;
    btnEl.textContent = 'Logout';
    btnEl.className = 'btn btn-sm btn-outline';
    btnEl.onclick = logout;
  } else {
    roleEl.textContent = 'GUEST';
    roleEl.className = 'role-badge guest';
    nameEl.textContent = 'Not Logged In';
    btnEl.textContent = 'Login';
    btnEl.className = 'btn btn-sm btn-primary';
    btnEl.onclick = openAuthModal;
  }
}

// Authentication Modal Logic
function setupAuthModal() {
  const modal = document.getElementById('authModal');
  const closeBtn = document.getElementById('closeAuthModal');
  const loginForm = document.getElementById('loginForm');
  const regForm = document.getElementById('registerForm');
  const toggleReg = document.getElementById('toggleRegisterBtn');
  const toggleLog = document.getElementById('toggleLoginBtn');

  closeBtn.onclick = () => modal.classList.remove('show');

  toggleReg.onclick = () => {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
  };

  toggleLog.onclick = () => {
    regForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  };

  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    await loginUser(email, password);
  };

  regForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        handleAuthSuccess(data);
        alert(`Account created successfully as ${role}!`);
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      alert('Error during registration: ' + err.message);
    }
  };
}

function openAuthModal() {
  document.getElementById('authModal').classList.add('show');
}

window.quickLogin = async function (email, password) {
  await loginUser(email, password);
};

async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      handleAuthSuccess(data);
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    alert('Login error: ' + err.message);
  }
}

function handleAuthSuccess(data) {
  state.accessToken = data.data.tokens.accessToken;
  state.refreshToken = data.data.tokens.refreshToken;
  state.user = data.data.user;

  localStorage.setItem('collab_access_token', state.accessToken);
  localStorage.setItem('collab_refresh_token', state.refreshToken);

  renderUserSession();
  document.getElementById('authModal').classList.remove('show');
  loadTasks();
  loadAnalytics();
}

function logout() {
  if (state.refreshToken) {
    authFetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken: state.refreshToken }),
    }).catch(() => {});
  }

  state.user = null;
  state.accessToken = null;
  state.refreshToken = null;
  localStorage.removeItem('collab_access_token');
  localStorage.removeItem('collab_refresh_token');

  renderUserSession();
  loadTasks();
}

// Load Projects for dropdowns
async function loadProjects() {
  try {
    const res = await authFetch(`${API_BASE}/projects`);
    if (res.ok) {
      const data = await res.json();
      state.projects = data.data.projects;
      const select = document.getElementById('newTaskProject');
      select.innerHTML = state.projects
        .map((p) => `<option value="${p._id}">${p.name}</option>`)
        .join('');
    }
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
}

// Load Tasks with Query Filters (Lecture 22)
async function loadTasks() {
  const tbody = document.getElementById('taskTableBody');
  const search = document.getElementById('taskSearchInput').value;
  const status = document.getElementById('filterStatus').value;
  const priority = document.getElementById('filterPriority').value;
  const sort = document.getElementById('filterSort').value;

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (priority) params.append('priority', priority);
  if (sort) params.append('sort', sort);
  params.append('page', state.currentPage);
  params.append('limit', 10);

  try {
    const res = await authFetch(`${API_BASE}/tasks?${params.toString()}`);
    if (res.status === 401) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem;">Please <button class="btn btn-sm btn-primary" onclick="openAuthModal()">Login</button> to view and manage tasks.</td></tr>`;
      return;
    }

    const data = await res.json();
    state.tasks = data.data.tasks;
    renderTasksTable(state.tasks);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--danger)">Error loading tasks: ${err.message}</td></tr>`;
  }
}

// Render Tasks in Table
function renderTasksTable(tasks) {
  const tbody = document.getElementById('taskTableBody');
  if (!tasks || tasks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 1.5rem; color: var(--text-muted)">No tasks match the filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = tasks
    .map((task) => {
      const projectName = task.project ? task.project.name : 'General';
      const assignedName = task.assignedTo ? task.assignedTo.name : 'Unassigned';

      return `
      <tr>
        <td>
          <strong>${task.title}</strong>
          ${task.description ? `<br><small style="color:var(--text-muted)">${task.description}</small>` : ''}
        </td>
        <td>${projectName}</td>
        <td>${assignedName}</td>
        <td><span class="priority-${task.priority}">${task.priority.toUpperCase()}</span></td>
        <td>
          <select class="form-control form-control-sm" onchange="changeTaskStatus('${task._id}', this.value)">
            <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="review" ${task.status === 'review' ? 'selected' : ''}>Review</option>
            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteTaskItem('${task._id}')">Delete</button>
        </td>
      </tr>
    `;
    })
    .join('');
}

// Change Task Status (Lecture 10, 11, 21)
window.changeTaskStatus = async function (taskId, newStatus) {
  try {
    const res = await authFetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      loadAnalytics();
    } else {
      const err = await res.json();
      alert(err.message || 'Failed to update task');
      loadTasks();
    }
  } catch (e) {
    alert('Error updating status: ' + e.message);
  }
};

// Delete Task (RBAC demo)
window.deleteTaskItem = async function (taskId) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  try {
    const res = await authFetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      loadTasks();
      loadAnalytics();
    } else {
      const err = await res.json();
      alert(`RBAC Blocked: ${err.message}`);
    }
  } catch (e) {
    alert('Error deleting task: ' + e.message);
  }
};

// Setup Task Modal
function setupTaskModal() {
  const modal = document.getElementById('taskModal');
  const openBtn = document.getElementById('openNewTaskModalBtn');
  const closeBtn = document.getElementById('closeTaskModal');
  const form = document.getElementById('createTaskForm');

  openBtn.onclick = () => {
    if (!state.user) {
      alert('Please log in first to create tasks.');
      openAuthModal();
      return;
    }
    modal.classList.add('show');
  };

  closeBtn.onclick = () => modal.classList.remove('show');

  form.onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById('newTaskTitle').value;
    const project = document.getElementById('newTaskProject').value;
    const description = document.getElementById('newTaskDesc').value;
    const priority = document.getElementById('newTaskPriority').value;
    const status = document.getElementById('newTaskStatus').value;

    try {
      const res = await authFetch(`${API_BASE}/tasks`, {
        method: 'POST',
        body: JSON.stringify({ title, project, description, priority, status }),
      });

      if (res.ok) {
        modal.classList.remove('show');
        form.reset();
        loadTasks();
        loadAnalytics();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create task');
      }
    } catch (err) {
      alert('Error creating task: ' + err.message);
    }
  };
}

// Setup Filters & Search
function setupFilters() {
  document.getElementById('taskSearchInput').oninput = debounce(() => loadTasks(), 300);
  document.getElementById('filterStatus').onchange = () => loadTasks();
  document.getElementById('filterPriority').onchange = () => loadTasks();
  document.getElementById('filterSort').onchange = () => loadTasks();
  document.getElementById('refreshTasksBtn').onclick = () => loadTasks();
  document.getElementById('refreshAnalyticsBtn').onclick = () => loadAnalytics();
}

function debounce(fn, ms) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// Load MongoDB Aggregation Analytics (Lecture 23)
async function loadAnalytics() {
  try {
    const res = await authFetch(`${API_BASE}/analytics/tasks`);
    if (!res.ok) return;

    const { data } = await res.json();

    document.getElementById('kpiProjects').textContent = data.summary.totalProjects;
    document.getElementById('kpiTasks').textContent = data.summary.totalTasks;

    const completedEntry = data.statusDistribution.find((s) => s.status === 'completed');
    document.getElementById('kpiCompleted').textContent = completedEntry ? completedEntry.count : 0;

    // Render Status Distribution
    const statusList = document.getElementById('statusDistributionList');
    statusList.innerHTML = data.statusDistribution
      .map(
        (item) => `
      <div class="dist-row">
        <span><strong class="tag tag-${item.status}">${item.status.toUpperCase()}</strong></span>
        <span><strong>${item.count}</strong> tasks</span>
      </div>
    `
      )
      .join('');

    // Render Priority Distribution
    const priorityList = document.getElementById('priorityDistributionList');
    priorityList.innerHTML = data.priorityDistribution
      .map(
        (item) => `
      <div class="dist-row">
        <span><strong class="priority-${item.priority}">${item.priority.toUpperCase()}</strong></span>
        <span><strong>${item.count}</strong> tasks</span>
      </div>
    `
      )
      .join('');
  } catch (err) {
    console.error('Failed to load analytics:', err);
  }
}

// Socket.IO Integration (Lectures 39 & 40)
function setupSocket() {
  if (typeof io === 'undefined') return;

  state.socket = io();

  const statusEl = document.getElementById('socketStatus');
  state.socket.on('connect', () => {
    statusEl.textContent = 'Socket: Connected';
    statusEl.className = 'socket-pill connected';
  });

  state.socket.on('disconnect', () => {
    statusEl.textContent = 'Socket: Disconnected';
    statusEl.className = 'socket-pill';
  });

  // Listen for broadcasted chat messages
  state.socket.on('chat:broadcast', (msg) => {
    appendChatMessage(msg);
  });

  // Listen for real-time notifications (triggered by EventEmitter / Task Controller)
  state.socket.on('notification', (data) => {
    appendNotification(data.message);
    loadTasks();
    loadAnalytics();
  });
}

function setupChat() {
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const roomSelect = document.getElementById('chatRoomSelect');

  roomSelect.onchange = () => {
    const room = roomSelect.value;
    if (state.socket) {
      state.socket.emit('join:room', room);
      appendNotification(`Switched to room: ${room}`);
    }
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const payload = {
      room: roomSelect.value,
      message: text,
      senderName: state.user ? state.user.name : 'Guest User',
      senderRole: state.user ? state.user.role : 'guest',
    };

    if (state.socket) {
      state.socket.emit('chat:message', payload);
    }

    input.value = '';
  };
}

function appendChatMessage(msg) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-bubble received';

  div.innerHTML = `
    <span class="sender-tag ${msg.role}">${msg.sender} (${msg.role})</span>
    <p>${escapeHtml(msg.text)}</p>
    <span class="chat-time">${msg.timestamp || new Date().toLocaleTimeString()}</span>
  `;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function appendNotification(text) {
  const feed = document.getElementById('notificationsFeed');
  const item = document.createElement('div');
  item.className = 'feed-item';
  item.textContent = text;
  feed.prepend(item);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
