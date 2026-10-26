
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
      setError("");
    } catch {
      setError("Could not connect to the backend. Please check that the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      await axios.post(API_URL, { title: title.trim() });
      setTitle("");
      fetchTasks();
    } catch {
      setError("Could not add the task. Please check the backend.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/${id}`, { status });
      fetchTasks();
    } catch {
      setError("Could not update the task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch {
      setError("Could not delete the task.");
    }
  };

  const statuses = ["Pending", "Ongoing", "Completed"];

  return (
    <div className="container py-5">
      <header className="dashboard-header mb-4">
        <h1>Task Management Dashboard</h1>
        <p>Organize your work and track your progress.</p>
      </header>

      <form className="input-group mb-4" onSubmit={addTask}>
        <input
          className="form-control"
          type="text"
          placeholder="Enter a new task..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add Task
        </button>
      </form>

      {error && <div className="alert alert-warning">{error}</div>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="row g-4">
          {statuses.map((status) => (
            <div className="col-md-4" key={status}>
              <section className={`task-column ${status.toLowerCase()}`}>
                <h2>
                  {status}
                  <span className="badge text-bg-secondary ms-2">
                    {tasks.filter((task) => task.status === status).length}
                  </span>
                </h2>

                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <article className="card task-card mb-3" key={task._id}>
                      <div className="card-body">
                        <p className="card-text">{task.title}</p>

                        <label className="form-label" htmlFor={`status-${task._id}`}>
                          Change status
                        </label>
                        <select
                          id={`status-${task._id}`}
                          className="form-select mb-3"
                          value={task.status}
                          onChange={(event) =>
                            updateStatus(task._id, event.target.value)
                          }
                        >
                          {statuses.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteTask(task._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}

                {tasks.filter((task) => task.status === status).length === 0 && (
                  <p className="empty-message">No tasks yet.</p>
                )}
              </section>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
