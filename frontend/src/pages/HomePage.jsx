import Navbar from "../components/Navbar";
import React from "react";
import Card from "../components/Card";


export default function HomePage() {
    return (
        <div 
            style={{ 
                minHeight: "100vh",
                display: "flex",
                alignItems: "flex-start",
                padding: "40px 0",
                background: "#00040eff" 
                //background: "#fff   "
            }}
       >
            <Navbar />
       </div>

    );

}