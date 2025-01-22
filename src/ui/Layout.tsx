import * as React from "react";
import "./Layout.css";

export const Layout: React.FC = () => {
  return (
    <div className="container">
      <div className="sidebar">
        <div className="sidebar-header">Company Name</div>
        <ul className="nav-links">
          <li>
            <a href="#dashboard">Dashboard</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#tasks">Tasks</a>
          </li>
          <li>
            <a href="#calendar">Calendar</a>
          </li>
          <li>
            <a href="#reports">Reports</a>
          </li>
          <li>
            <a href="#settings">Settings</a>
          </li>
        </ul>
      </div>
      <div className="main-content">
        <div className="content-header">
          <h1>Welcome to Dashboard</h1>
        </div>
        <div className="content-section">
          <h2>Overview</h2>
          <p>
            This is a simple example of a website layout with a sidebar
            navigation. The sidebar stays fixed while the main content can
            scroll independently. Hover over the navigation links to see the
            interactive effect.
          </p>
          <p>
            The design uses a modern color scheme and includes subtle shadows
            and transitions for a polished look.
          </p>
        </div>
      </div>
    </div>
  );
};
