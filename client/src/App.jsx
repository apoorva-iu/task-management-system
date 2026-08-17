import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("tm_token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("tm_user") || "{}"));
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [taskForm, setTaskForm] = useState({ title: "", description: "", category: "Work", status: "Todo" });
  const [editId, setEditId] = useState(null);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/tasks`, authHeader);
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Sign In Flow -> Sets credentials and goes directly to dashboard
        const res = await axios.post(`${API_BASE}/api/auth/login`, authForm);
        localStorage.setItem("tm_token", res.data.token);
        localStorage.setItem("tm_user", JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
      } else {
        // Register Flow -> Creates account, notifies user, and redirects to Sign In screen
        await axios.post(`${API_BASE}/api/auth/register`, authForm);
        alert("Account created successfully! Please sign in with your credentials.");
        setIsLogin(true);
        setAuthForm({ name: "", email: authForm.email, password: "" });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Authentication error");
    }
  };

  const logout = () => {
    localStorage.removeItem("tm_token");
    localStorage.removeItem("tm_user");
    setToken(null);
    setUser({});
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE}/api/tasks/${editId}`, taskForm, authHeader);
      } else {
        await axios.post(`${API_BASE}/api/tasks`, taskForm, authHeader);
      }
      setTaskForm({ title: "", description: "", category: "Work", status: "Todo" });
      setEditId(null);
      fetchTasks();
    } catch (err) {
      alert("Failed to save task");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await axios.delete(`${API_BASE}/api/tasks/${id}`, authHeader);
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${API_BASE}/api/tasks/${id}`, { status }, authHeader);
    fetchTasks();
  };

  const totalCount = tasks.length;
  const todoCount = tasks.filter((t) => t.status === "Todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || t.category === categoryFilter;
    const matchStat = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchCat && matchStat;
  });

  return (
    <>
      <div className="mesh-glow-bg"></div>

      {/* AUTH SCREEN */}
      {!token ? (
        <div className="auth-wrapper">
          <div className="auth-glass-box glass-container">
            <div className="auth-left-banner">
              <div className="auth-brand-logo">
                <span>✨</span> TaskFlow
              </div>
              <div className="auth-banner-content">
                <h1>Smart Task Management.</h1>
                <p>Stay focused, organize daily goals, and streamline your workflow with ease.</p>
              </div>
              <div className="glass-pill-highlight">
                <div>
                  <span>Focus</span>
                  <strong>Daily Goals</strong>
                </div>
                <div>
                  <span>Workflow</span>
                  <strong>Real-Time Sync</strong>
                </div>
              </div>
            </div>

            <div className="auth-right-form">
              <div className="auth-form-heading">
                <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
                <p>{isLogin ? "Sign in to access your dashboard" : "Register to start organizing your tasks"}</p>
              </div>

              <form onSubmit={handleAuth}>
                {!isLogin && (
                  <div className="glass-input-group">
                    <label>Full Name</label>
                    <input className="glass-input" required placeholder="Apoorva I U" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
                  </div>
                )}
                <div className="glass-input-group">
                  <label>Email Address</label>
                  <input className="glass-input" type="email" required placeholder="name@example.com" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
                </div>
                <div className="glass-input-group">
                  <label>Password</label>
                  <input className="glass-input" type="password" required placeholder="••••••••" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
                </div>

                <button type="submit" className="btn-glass-primary" style={{ width: "100%", marginTop: "6px" }}>
                  {isLogin ? "Sign In" : "Get Started"}
                </button>
              </form>

              <div className="auth-switch-prompt">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Register here" : "Sign in"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PROFESSIONAL DASHBOARD SCREEN */
        <div className="dashboard-page-wrapper">
          <nav className="glass-navbar">
            <div className="nav-brand-title">
              <span>✨</span> TaskFlow
            </div>
            <div className="nav-profile-section">
              <span className="glass-user-badge">👤 {user.name || user.email}</span>
              <button className="btn-glass-logout" onClick={logout}>Sign Out</button>
            </div>
          </nav>

          <main className="main-content-layout">
            {/* Header Title Banner */}
            <div className="dashboard-header-banner">
              <div>
                <h2>Task Operations Dashboard</h2>
                <p>Monitor your active pipeline, manage action items, and maintain project progress.</p>
              </div>
            </div>

            {/* Overview Metric Cards */}
            <div className="glass-metrics-grid">
              <div className="glass-stat-card glass-container">
                <div className="stat-header-row">
                  <span className="stat-label-text">Total Tasks</span>
                  <span className="stat-icon">📊</span>
                </div>
                <div className="stat-number-display" style={{ color: "#0f172a" }}>{totalCount}</div>
                <div className="stat-subtext">All active items</div>
              </div>

              <div className="glass-stat-card glass-container">
                <div className="stat-header-row">
                  <span className="stat-label-text">To Do</span>
                  <span className="stat-icon">⏳</span>
                </div>
                <div className="stat-number-display" style={{ color: "#d97706" }}>{todoCount}</div>
                <div className="stat-subtext">Pending start</div>
              </div>

              <div className="glass-stat-card glass-container">
                <div className="stat-header-row">
                  <span className="stat-label-text">In Progress</span>
                  <span className="stat-icon">⚡</span>
                </div>
                <div className="stat-number-display" style={{ color: "#4f46e5" }}>{inProgressCount}</div>
                <div className="stat-subtext">Currently executing</div>
              </div>

              <div className="glass-stat-card glass-container">
                <div className="stat-header-row">
                  <span className="stat-label-text">Completed</span>
                  <span className="stat-icon">✅</span>
                </div>
                <div className="stat-number-display" style={{ color: "#059669" }}>{completedCount}</div>
                <div className="stat-subtext">Finished items</div>
              </div>
            </div>

            {/* Task Creation & Edit Form */}
            <div className="glass-panel glass-container">
              <div className="glass-panel-title">{editId ? "✏️ Edit Task Details" : "➕ Create New Task"}</div>
              <form onSubmit={handleTaskSubmit} className="glass-form-grid">
                <input className="glass-input" required placeholder="Task title / action item..." value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
                <select className="glass-input" value={taskForm.category} onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <select className="glass-input" value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="submit" className="btn-glass-primary">{editId ? "Update" : "Add Task"}</button>
                  {editId && (
                    <button type="button" className="btn-action-icon" onClick={() => { setEditId(null); setTaskForm({ title: "", description: "", category: "Work", status: "Todo" }); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Search & Filter Bar */}
            <div className="glass-panel glass-container filter-wrapper">
              <div className="glass-filter-grid">
                <input className="glass-input" placeholder="🔍 Search tasks by title..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select className="glass-input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <select className="glass-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Task Grid Cards */}
            <div className="glass-task-grid">
              {filteredTasks.map((t) => (
                <div className={`glass-task-item glass-container item-status-${t.status.replace(" ", "-")}`} key={t._id}>
                  <div>
                    <div className="task-item-header">
                      <span className={`glass-badge badge-${t.status.replace(" ", "-")}`}>{t.status}</span>
                      <span className="category-indicator">{t.category}</span>
                    </div>
                    <div className="task-heading-title">{t.title}</div>
                  </div>

                  <div className="task-footer-bar">
                    <select className="status-dropdown" value={t.status} onChange={(e) => updateStatus(t._id, e.target.value)}>
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <div className="glass-action-btns">
                      <button className="btn-action-icon btn-edit-glass" onClick={() => { setEditId(t._id); setTaskForm({ title: t.title, description: t.description || "", category: t.category, status: t.status }); }}>
                        ✏️ Edit
                      </button>
                      <button className="btn-action-icon btn-del-glass" onClick={() => deleteTask(t._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="glass-container" style={{ textAlign: "center", padding: "48px 20px", color: "#64748b", marginTop: "12px" }}>
                <h3 style={{ fontSize: "16px", color: "#1e293b", marginBottom: "4px" }}>No tasks found</h3>
                <p style={{ fontSize: "13px" }}>Create a new task above or adjust your search filters.</p>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
}