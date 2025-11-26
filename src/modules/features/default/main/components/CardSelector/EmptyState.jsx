import { Grid } from '@mui/material';
import MessageDark from 'components/message/MessageDark';

const EmptyState = () => (
    <Grid container style={{ marginTop: 20 }}>
        <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <MessageDark message={'No existen cartillas para este evento!'} submessage="" />
            </Grid>
        </Grid>
    </Grid>
);

export default EmptyState;
