import React from 'react'
import styled from 'styled-components'
import avatar from '../img/avatar.png'
import { signout } from '../utils/Icons'
import { MenuItems } from '../utils/MenuItems'

function Navigation({active, setActive}) {
    
    return (
        <NavStyled>
            <div className="user-con">
                <img src={avatar} alt="" />
                <div className="text">
                    <h2>Username</h2>
                    <p>Role</p>
                    <p>Tech ID</p>
                </div>
            </div>
            <ul className="menu-items">
                {MenuItems.map((item) => {
                    return <li
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={active === item.id ? 'active': ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                })}
            </ul>
            <div className="bottom-nav">
                <li>
                    {signout} Sign Out
                </li>
            </div>
        </NavStyled>
    )
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 250px;
    height: 100%;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;

    .user-con {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin: auto;
        gap: 1rem;

        img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #AFD275;
        }

        h2 {
            color: rgba(34, 34, 96, 1);
        }

        p {
            color: rgba(34, 34, 96, 0.6);
        }
    }

    .menu-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: 0.8rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.4s ease-in-out;
            color: rgba(34, 34, 96, 0.6);
            position: relative;
        }
        span {
            width: 100px;
        }
    .active{
        color: rgba(34, 34, 96, 1);
        i{
            color: rgba(34, 34, 96, 1);
        }
        &::before{
            content: "";
            position: absolute;
            left: -5px;
            top: 0;
            width: 4px;
            height: 100%;
            background: #222260;
            border-radius: 10px 10px 10px 10px;
        }
    }
`;


export default Navigation