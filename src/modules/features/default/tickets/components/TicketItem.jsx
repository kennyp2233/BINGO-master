import React from 'react';
import { Box, ButtonBase, Typography, useTheme } from '@mui/material';
import { IconTicket } from '@tabler/icons';

const TicketItem = ({ ticket, onClick }) => {
    const theme = useTheme();

    return (
        <ButtonBase
            onClick={() => onClick(ticket)}
            sx={{
                width: '100%',
                borderRadius: 2,
                position: 'relative',
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'scale(1.02)'
                }
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    aspectRatio: '1/1',
                    bgcolor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.text.primary,
                    boxShadow: theme.shadows[1],
                    '&:hover': {
                        bgcolor: theme.palette.action.hover,
                        borderColor: theme.palette.primary.main,
                        boxShadow: theme.shadows[4]
                    },
                    p: 2
                }}
            >
                <IconTicket size={32} color={theme.palette.primary.main} style={{ marginBottom: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    #{ticket.order}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {ticket.id.slice(-6).toUpperCase()}
                </Typography>
            </Box>
        </ButtonBase>
    );
};

export default TicketItem;
