import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Toolbar,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Build as ServicesIcon,
    ShoppingCart as OrdersIcon,
    People as UsersIcon,
    Payments as PaymentsIcon,
    Inventory2 as ProductsIcon,
    AddBusiness as AddBusinessIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import logo from '../assets/BoldTribe_Logo-removebg-preview.png';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        background: 'linear-gradient(180deg, #2193b0 0%, #6dd5ed 100%)',
        borderRight: 'none',
        boxShadow: '4px 0 8px rgba(0, 0, 0, 0.1)',
    }
});

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
    margin: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: selected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
    boxShadow: selected ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
    '&:hover': {
        backgroundColor: selected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transform: 'translateY(-2px)',
    },
    '& .MuiListItemIcon-root': {
        color: selected ? '#2193b0' : '#ffffff',
    },
    '& .MuiListItemText-primary': {
        color: selected ? '#2193b0' : '#ffffff',
        fontWeight: selected ? 600 : 400,
    },
}));

const LogoBox = styled(Box)({
    padding: '20px',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    marginBottom: '10px',
    '& img': {
        maxWidth: '150px',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'scale(1.05)',
        }
    }
});

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPath, setSelectedPath] = useState('/');

    useEffect(() => {
        // Update selected path when location changes
        setSelectedPath(location.pathname);
    }, [location]);

    const handleNavigation = (path) => {
        navigate(path);
        setSelectedPath(path);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Services', icon: <AddBusinessIcon />, path: '/services' },
        { text: 'Products', icon: <ProductsIcon />, path: '/products' },
        { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
        { text: 'Users', icon: <UsersIcon />, path: '/users' },
        { text: 'Payments', icon: <PaymentsIcon />, path: '/payments' },
    ];

    return (
        <StyledDrawer variant="permanent">
            <Toolbar />
            <LogoBox>
                <img 
                    src={logo} 
                    alt="Logo"
                    style={{
                        width: 'auto',
                        maxWidth: '180px'
                    }}
                />
            </LogoBox>
            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <StyledListItem
                        button
                        key={item.text}
                        onClick={() => handleNavigation(item.path)}
                        selected={selectedPath === item.path}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText 
                            primary={item.text}
                            primaryTypographyProps={{
                                fontSize: '0.95rem',
                            }}
                        />
                    </StyledListItem>
                ))}
            </List>
        </StyledDrawer>
    );
};

export default Sidebar;