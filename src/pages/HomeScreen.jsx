import React from "react";

export default function HomeScreen() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Bentork</h1>
      <p style={styles.subtitle}>Your EV Charging Partner ⚡</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#00a651",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#333",
  },
};
