import DiscardedItems from '../Components/DiscardedItems/DiscardedItems'
import {Checkout, Inventory, Reports, Members} from './Icons'

export const MenuItems = [
    {
        id: 1,
        title: 'Checkout',
        icon: Checkout,
        link: '/dashboard'
    },
    {
        id: 2,
        title: "Inventory",
        icon: Inventory,
        link: "/dashboard",
    },
    {
        id: 3,
        title: "Reports",
        icon: Reports,
        link: "/dashboard",
    },
    {
        id: 4,
        title: "Members",
        icon: Members,
        link: "/dashboard",
    },
    {
        id: 5,
        title: "Discarded Items",
        icon: Inventory,
        link: "/dashboard",
    },
]