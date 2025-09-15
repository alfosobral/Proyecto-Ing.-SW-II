import Navbar from "../components/Navbar";

export default function MainPage() {
    return (
        <div 
            style={{ 
                minHeight: "100vh",
                display: "flex",
                alignItems: "flex-start",
                padding: "40px 0",
                background: "#051f65ff" 
            }}
       >
            <Navbar />
       </div>

    );

}