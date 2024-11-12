// Filename - App.js

// From https://www.geeksforgeeks.org/how-to-connect-reactjs-with-flask-api/

// Importing modules
import React from "react";
import "./App.css";
import styled from "styled-components";
import {MainLayout} from './styles/Layouts';
import NavigationBar from "./navigationBar/NavigationBar";
import Checkout from "./Components/Checkout/Checkout";
import Inventory from "./Components/Inventory/Inventory";
import Reports from "./Components/Reports/Reports";
import Members from "./Components/Members/Members";
import DiscardedItems from "./Components/DiscardedItems/DiscardedItems";

function App() {
    const [active, setActive] = React.useState(1)

    const displayData = () => {
        switch(active) {
            case 1:
                return <Checkout />
            case 2:
                return <Inventory />
            case 3:
                return <Reports />
            case 4:
                return <Members />
            case 5:
                return <DiscardedItems />
            default:
                return <Checkout />
        }
    }
    return (
        <AppStyled className="App">
            <MainLayout>
                <NavigationBar active={active} setActive={setActive} />
                <main>
                    {displayData()}
                </main>
            </MainLayout>
        </AppStyled>
    );
}

const AppStyled = styled.div`
    height: 100vh;
    background: linear-gradient(45deg, #AFD275, #D0E5A0);
    position: relative;

    main {
        flex: 1;
        background: rgba(252, 246, 249, 0.78);
        border: 3px solid #FFFFFF;
        backdrop-filter: blur(4.5px);
        border-radius: 32px;
        overflow-x: hidden;
        &::-webkit-scrollbar{
            width: 0;
        }
    }

`;

export default App;
