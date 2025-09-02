import Register from "./pages/Register";
import logo from "./assets/HurryHand.svg";

export default function App() {
  return (
    <div 
      style={{ 
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px 0",
        background: "#8ddfffff" 
      }}
    >
      <Register width={600}/>
    </div>
  );
}
