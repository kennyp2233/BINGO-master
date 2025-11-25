import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Paper, Button, Typography, Grid, Modal } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { getGamesList } from 'modules/features/admin/events';
import { EventCard } from 'modules/features/admin/events';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uiStyles } from '../card-assignment.styles';
import { titles } from '../card-assignment.texts';
import { UsersStepTable } from './UsersStepTable';
import { SelectCardStep } from './SelectCardStep';
import { PurchaseSummaryStep } from './PurchaseSummaryStep';

export function CardsUser() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [finishAssign, setFinishAssign] = useState(false);

  const [search, setSearch] = useState('');
  const [openLoader, setOpenLoader] = useState(false);

  const handleStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      label: 'Evento ' + (event?.name || ''),
      description: 'Selecciona el evento al cual quieres asignar usuario.',
      onClick: handleStep
    },
    {
      label: 'Usuario ' + (user?.fullName || ''),
      description: 'Selecciona el usuario al cual quieres asignar cartillas.',
      onClick: handleStep
    },
    {
      label: 'Asignar Cartillas',
      description: 'Selecciona una o más cartillas para asignar al usuario seleccionado.',
      onClick: handleStep
    },
    {
      label: 'Resumen de Asignación',
      description: 'Revise el resumen del pago y confirme la asignación.',
      onClick: () => {}
    }
  ];

  const maxSteps = steps.length;

  useEffect(() => {
    getGamesList().then((data) => {
      setEvents(data);
    });
  }, []);

  const handleResetSteps = () => {
    setActiveStep(0);
    setEvent(null);
    setUser(null);
    setSelectedItems([]);
    setFinishAssign(false);
  };

  return (
    <Box sx={{ maxWidth: '100%', flexGrow: 1 }}>
      <ToastContainer />
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
          borderRadius: 3
        }}
      >
        <Typography style={{ fontSize: 18, fontWeight: 'bold' }}>{steps[activeStep].label}</Typography>
      </Paper>
      <Box sx={{ height: '100%', maxWidth: '100%', width: '100%', p: 2 }}>{steps[activeStep].description}</Box>
      <Box sx={{ height: '100%', maxWidth: '100%', width: '100%', p: 2 }}>
        {activeStep === 0 ? (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                {events.map((item, key) => (
                  <Grid key={key} item lg={3} md={3} sm={6} xs={12}>
                    <div
                      onClick={() => {
                        setEvent(item);
                      }}
                      aria-hidden="true"
                      style={{ cursor: 'pointer' }}
                    >
                      <EventCard name={item.name} date={item.startDate} bg={event?.ide === item.ide ? '#0d6889' : '#00adef'} />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        ) : activeStep === 1 ? (
          <UsersStepTable setUser={setUser} user={user} />
        ) : activeStep === 2 ? (
          <SelectCardStep event={event} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        ) : (
          <PurchaseSummaryStep
            event={event}
            selectedItems={selectedItems}
            user={user}
            finishAssign={finishAssign}
            setFinishAssign={setFinishAssign}
            handleResetSteps={handleResetSteps}
          />
        )}
      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        sx={{ borderRadius: 3 }}
        nextButton={
          <Button
            size="small"
            onClick={() => {
              if (activeStep === 0) {
                if (!event) {
                  toast.info('Seleccione algun evento!', { position: toast.POSITION.TOP_RIGHT });
                } else {
                  steps[activeStep].onClick();
                }
              }

              if (activeStep === 1) {
                if (!user) {
                  toast.info('Seleccione un usuario!', { position: toast.POSITION.TOP_RIGHT });
                } else {
                  steps[activeStep].onClick();
                }
              }

              if (activeStep === 2) {
                if (selectedItems.length === 0) {
                  toast.info('Seleccione al menos una cartilla', { position: toast.POSITION.TOP_RIGHT });
                } else {
                  steps[activeStep].onClick();
                }
              }
            }}
            disabled={activeStep === maxSteps - 1}
          >
            Siguiente
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0 || finishAssign}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Regresar
          </Button>
        }
      />
      <Modal open={openLoader} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <center>
          <Box sx={uiStyles.modalStylesLoader}>
            <CircularProgress color="info" size={100} />
          </Box>
        </center>
      </Modal>
    </Box>
  );
}