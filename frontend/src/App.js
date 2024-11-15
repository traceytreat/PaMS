// Filename - App.js

// Importing modules
import React, { useState } from "react";
import "./App.css";
import styled from "styled-components";
import { MainLayout } from './styles/Layouts';
import NavigationBar from "./navigationBar/NavigationBar";
import Checkout from "./Components/Checkout/Checkout";
import Inventory from "./Components/Inventory/Inventory";
import Reports from "./Components/Reports/Reports";
import Members from "./Components/Members/Members";
import DiscardedItems from "./Components/DiscardedItems/DiscardedItems";
import Login from "./Components/Login/Login";

function App() {
    const [active, setActive] = useState(1);
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setLoggedIn(true);
    };

    const Logout = () => {
        setLoggedIn(false);
    };

    const displayData = () => {
        switch (active) {
            case 1:
                return <Checkout />;
            case 2:
                return <Inventory />;
            case 3:
                return <Reports />;
            case 4:
                return <Members />
            case 5:
                return <DiscardedItems />
            default:
                return <Checkout />;
        }
    };

    return (
        <AppStyled className="App">
            {!loggedIn ? (
                <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
                <MainLayout>
                    <NavigationBar 
                        active={active} 
                        setActive={setActive} 
                        username={user.username}
                        role={user.role}
                        techid={user.techid}
                        onLogout={Logout}
                    />
                    <main>
                        {displayData()}
                    </main>
                </MainLayout>
            )}
        </AppStyled>
    );
}

const AppStyled = styled.div`
    height: 100vh;
    position: relative;

    main {
        flex: 1;
        background: rgba(252, 246, 249, 0.78);
        border: 3px solid #FFFFFF;
        backdrop-filter: blur(4.5px);
        border-radius: 32px;
        overflow-x: hidden;
        &::-webkit-scrollbar {
            width: 0;
        }
    }
`;

export default App;
