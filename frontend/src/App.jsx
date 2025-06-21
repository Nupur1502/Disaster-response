import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./index.css";

const socket = io("http://localhost:3000");

export default function App() {
  const [form, setForm] = useState({
    title: "",
    location_name: "",
    description: "",
    tags: "",
  });
  const [disasters, setDisasters] = useState([]);
  const [dark, setDark] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [reportMap, setReportMap] = useState({});
  const [visibleReports, setVisibleReports] = useState({});
  const [resourceMap, setResourceMap] = useState({});
  const [visibleResources, setVisibleResources] = useState({});

  const toggleDark = () => {
    document.body.classList.toggle("dark");
    setDark(!dark);
  };

  const fetchDisasters = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/disasters");
      const data = await res.json();
      setDisasters(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchReports = async (disasterId) => {
    const visible = visibleReports[disasterId];
    if (visible) {
      setVisibleReports((prev) => ({ ...prev, [disasterId]: false }));
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/disasters/${disasterId}/reports`);
      const data = await res.json();
      setReportMap((prev) => ({ ...prev, [disasterId]: data }));
      setVisibleReports((prev) => ({ ...prev, [disasterId]: true }));
    } catch (err) {
      console.error("Fetch reports error:", err);
      alert("❌ Could not fetch reports.");
    }
  };

  const fetchResources = async (lat, lon, id) => {
    const visible = visibleResources[id];
    if (visible) {
      setVisibleResources((prev) => ({ ...prev, [id]: false }));
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/resources?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setResourceMap((prev) => ({ ...prev, [id]: data }));
      setVisibleResources((prev) => ({ ...prev, [id]: true }));
    } catch (err) {
      console.error("Fetch resources error:", err);
      alert("❌ Could not fetch resources.");
    }
  };

  useEffect(() => {
    fetchDisasters();

    socket.on("disaster_updated", (update) => {
      alert(`🚨 Disaster ${update.type}: ${update.data.title}`);
      fetchDisasters();
    });

    socket.on("report_added", (payload) => {
      alert(`📩 New Report for Disaster ID: ${payload.data.disaster_id}`);
    });

    return () => {
      socket.off("disaster_updated");
      socket.off("report_added");
    };
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:3000/api/disasters/${editingId}`
      : "http://localhost:3000/api/disasters";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()),
          owner_id: "netrunnerX",
        }),
      });

      if (res.ok) {
        alert(editingId ? "✅ Disaster updated!" : "✅ Disaster submitted!");
        setForm({ title: "", location_name: "", description: "", tags: "" });
        setEditingId(null);
        fetchDisasters();
      } else {
        alert("❌ Submission failed.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Server error.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this disaster?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/api/disasters/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("🗑️ Disaster deleted!");
        fetchDisasters();
      } else {
        alert("❌ Failed to delete.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Server error.");
    }
  };

  const handleReportSubmit = async (e, disasterId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const content = formData.get("content");
    const image_url = formData.get("image_url");

    try {
      const res = await fetch("http://localhost:3000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disaster_id: disasterId,
          user_id: "citizen1",
          content,
          image_url,
        }),
      });

      if (res.ok) {
        alert("✅ Report submitted!");
        e.target.reset();
        fetchReports(disasterId);
      } else {
        alert("❌ Report submission failed.");
      }
    } catch (err) {
      console.error("Report error:", err);
      alert("❌ Server error.");
    }
  };

  return (
    <div className="bg-wrapper">
      <button className="theme-toggle" onClick={toggleDark}>
        {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="container">
        <h1>🚨 Disaster Reporting</h1>

        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Disaster Title" value={form.title} onChange={handleChange} required />
          <input name="location_name" placeholder="Location Name" value={form.location_name} onChange={handleChange} required />
          <textarea name="description" rows="4" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />
          <button type="submit">{editingId ? "Update Disaster" : "Submit Disaster"}</button>
        </form>
      </div>

      <h2 className="disaster-heading">📋 All Disasters</h2>
      <div className="disaster-list">
        {disasters.length === 0 ? (
          <p style={{ textAlign: "center" }}>No disasters found.</p>
        ) : (
          disasters.map((d) => (
            <div className="disaster-card" key={d.id}>
              <h3>{d.title}</h3>
              <p><strong>Location:</strong> {d.location_name}</p>
              <p><strong>Description:</strong> {d.description}</p>
              <p><strong>Tags:</strong> {d.tags.join(", ")}</p>
              <div style={{ marginTop: "10px" }}>
                <button className="edit-btn" onClick={() => {
                  setForm({
                    title: d.title,
                    location_name: d.location_name,
                    description: d.description,
                    tags: d.tags.join(", "),
                  });
                  setEditingId(d.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(d.id)}>🗑️ Delete</button>
                <button className="edit-btn" onClick={() => fetchReports(d.id)}>
                  📄 {visibleReports[d.id] ? "Hide" : "Show"} Reports
                </button>
                <button className="edit-btn" onClick={() => fetchResources(d.latitude, d.longitude, d.id)}>
                  🧭 {visibleResources[d.id] ? "Hide" : "Show"} Resources
                </button>
              </div>

              <form className="report-form" onSubmit={(e) => handleReportSubmit(e, d.id)}>
                <textarea name="content" placeholder="Your report..." required />
                <input name="image_url" placeholder="Image URL (optional)" />
                <button type="submit" style={{ padding: "6px 12px" }}>Submit Report</button>
              </form>

              {visibleReports[d.id] && reportMap[d.id]?.length > 0 && (
                <div className="report-list">
                  {reportMap[d.id].map((report) => (
                    <div className="report-item" key={report.id}>
                      <p><strong>{report.user_id}</strong>: {report.content}</p>
                      {report.image_url && (
                        <img src={report.image_url} alt="report" style={{ maxWidth: "100%", marginTop: "5px" }} />
                      )}
                      <p className="veri-status">🔍 Status: {report.verification_status}</p>
                    </div>
                  ))}
                </div>
              )}

              {visibleResources[d.id] && resourceMap[d.id]?.length > 0 && (
                <div className="resource-list">
                  {resourceMap[d.id].map((r) => (
                    <div key={r.id} className="resource-item">
                      <p><strong>{r.name}</strong> ({r.type})</p>
                      <p>📍 {r.location_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}