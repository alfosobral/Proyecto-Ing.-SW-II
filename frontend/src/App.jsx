import Register from "./pages/Register";

export default function App() {
  return (
    <div 
      style={{ 
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 0",
        background: "#7bedffff" 
      }}
    >
      <Register width={600}/>
    </div>
  );
}
