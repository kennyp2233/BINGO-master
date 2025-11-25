import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import EventCard from './EventCard';
import { gameService } from '../../main/services/gameService';
import MessageDark from 'components/message/MessageDark';

const Dashboard = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await gameService.getActiveGamesList();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    return (
        <Grid container spacing={1}>
            {events.length > 0 ? (
                events.map((item) => (
                    <Grid key={item.ide} item lg={3} md={4} sm={6} xs={12}>
                        <EventCard
                            name={item.name}
                            date={item.startDate}
                            bg="#00adef"
                            id={item.ide}
                            transmition={item.transmition}
                            state={item.state}
                        />
                    </Grid>
                ))
            ) : (
                <Grid item xs={12} style={{ marginTop: 20 }}>
                    <MessageDark message="No hay eventos aún!" submessage="" />
                </Grid>
            )}
        </Grid>
    );
};

export default Dashboard;