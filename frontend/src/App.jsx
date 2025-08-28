import Register from "./pages/Register";

export default function App() {
  return (
    <div 
      style={{ 
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px 0",
        background: "#89f1ffff" 
      }}
    >
      <Register width={600}/>
    </div>
  );
}
