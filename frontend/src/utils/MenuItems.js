import DiscardedItems from '../Components/DiscardedItems/DiscardedItems'
import EditMembers from '../Components/EditMembers/EditMembers'
import {Checkout, Inventory, Reports, Members} from './Icons'

export const MenuItems = [
    {
        id: 1,
        title: 'Checkout',
        icon: Checkout,
        link: '/dashboard',
        role: ['user', 'admin']
    },
    {
        id: 2,
        title: "Inventory",
        icon: Inventory,
        link: "/dashboard",
        role: ['user', 'admin']
    },
    {
        id: 3,
        title: "Reports",
        icon: Reports,
        link: "/dashboard",
        role: ['user', 'admin'],
    },
    {
        id: 4,
        title: "Members",
        icon: Members,
        link: "/dashboard",
        role: ['user', 'admin'],
    },
    {
        id: 5,
        title: "Discarded Items",
        icon: Inventory,
        link: "/dashboard",
        role: ['user', 'admin'],
    },
    {
        id: 6,
        title: "Users",
        icon: Members,
        link: "/dashboard",
        role: "admin",
    },
    {
        id: 7,
        title: "Edit Members",
        icon: Members,
        link: "/dashboard",
        role: "admin",
    },

]