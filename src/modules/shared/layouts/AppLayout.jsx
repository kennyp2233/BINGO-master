import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useNavigate } from 'react-router-dom';
import { CssBaseline, Container, Box, useTheme } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';

// project imports
import Header from 'modules/shared/components/Header';
import Footer from 'modules/shared/components/Footer';

const AppLayout = ({ requireAuth = false }) => {
    const theme = useTheme();
    let navigate = useNavigate();

    useEffect(() => {
        if (requireAuth) {
            const unsubscribe = onAuthStateChanged(authentication, (user) => {
                if (!user) {
                    navigate('/');
                }
            });
            return () => unsubscribe();
        }
    }, [requireAuth, navigate]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <CssBaseline />

            {/* Header fijo */}
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
                <Header />
            </Box>

            {/* Contenido principal */}
            <Container
                maxWidth="xl"
                sx={{
                    flexGrow: 1,

                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Outlet />
            </Container>

            <Footer />
        </Box>
    );
};

AppLayout.propTypes = {
    requireAuth: PropTypes.bool
};

export default AppLayout;
