import { useState } from 'react';
import { Box, Button, ButtonGroup, FormControl, Grid, InputLabel, Modal, OutlinedInput, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { uiStyles } from './Users.styles';
import { inputLabels, titles } from './Users.texts';
import { genConst } from 'store/constant';
import { IconCircleX, IconDeviceFloppy, IconSquarePlus } from '@tabler/icons';
import { createDocument } from 'config/firebaseEvents';
import { collUsers } from 'store/collections';
import { fullDate } from 'modules/shared/utils/validations';
import { toast } from 'react-toastify';
import { generateId } from 'modules/shared/utils/idGenerator';
import PropTypes from 'prop-types';

const defaultValues = {
  name: '',
  lastName: '',
  dni: '',
  email: '',
  phone: '',
  state: genConst.CONST_STA_ACT
};

export const AddUserModal = ({ onSuccess }) => {
  const theme = useTheme();
  const [openCreate, setOpenCreate] = useState(false);
  const [formData, setFormData] = useState(defaultValues);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: false,
    lastName: false,
    dni: false
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleSubmit = async () => {
    // console.log('Form submitted:', formData);
    const newErrors = {
      name: !formData.name.trim(),
      lastName: !formData.lastName.trim(),
      dni: !formData.dni.trim()
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) return;

    try {
      setLoading(true);
      const idUsr = generateId(10);
      // setOpenLoader(true);
      const userObject = {
        id: idUsr,
        dni: formData.dni,
        email: formData.email,
        name: formData.name,
        lastName: formData.lastName,
        fullName: `${formData.name} ${formData.lastName}`,
        phone: formData.phone,
        profile: genConst.CONST_PRO_DEF,
        state: genConst.CONST_STA_ACT,
        provider: 'local',
        createAt: fullDate(),
        avatar: null,
        description: null,
        updateAt: null
      };

      await createDocument(collUsers, idUsr, userObject);
      toast.success(titles.successCreate, { position: toast.POSITION.TOP_RIGHT });
      onSuccess?.();
      handleCloseCreate();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(titles.generalError, { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setFormData(defaultValues);
    setErrors({
      name: false,
      lastName: false,
      dni: false
    });
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenCreate}
        sx={{
          minWidth: '40px',
          width: '40px',
          height: '40px',
          padding: '8px'
        }}
        style={{ backgroundColor: genConst.CONST_PRIMARY_COLOR, color: '#FFF' }}
      >
        <IconSquarePlus size={24} />
      </Button>
      <Modal open={openCreate} onClose={handleCloseCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
        <Box sx={uiStyles.modalStyles}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            Agregar Usuario
            {/* {title} {isEdit ? <strong style={{ fontSize: 16 }}>{id}</strong> : <></>} */}
          </Typography>
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }} error={errors.name}>
                    <InputLabel htmlFor="name">
                      <span>*</span> {inputLabels.labelName}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.name}
                      type="text"
                      name={inputLabels.name}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }} error={errors.lastName}>
                    <InputLabel htmlFor="lastName">
                      <span>*</span> {inputLabels.labelLastName}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.lastName}
                      type="text"
                      name={inputLabels.lastName}
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }} error={errors.dni}>
                    <InputLabel htmlFor="dni">
                      <span>*</span> {inputLabels.labelDni}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.dni}
                      type="text"
                      name={inputLabels.dni}
                      value={formData.dni}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="email">
                      {/* <span>*</span>  */}
                      {inputLabels.labelEmail}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.email}
                      type="email"
                      name={inputLabels.email}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="phone">
                      {/* <span>*</span>  */}
                      {inputLabels.labelPhone}
                    </InputLabel>
                    <OutlinedInput
                      id={inputLabels.phone}
                      type="text"
                      name={inputLabels.phone}
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id={inputLabels.profile}>* {inputLabels.labelProfile}</InputLabel>
                    <Select
                      labelId={inputLabels.profile}
                      id={inputLabels.profile}
                      value={profile}
                      label={inputLabels.labelProfile}
                      onChange={(ev) => setProfile(ev.target.value)}
                    >
                      <MenuItem value={genConst.CONST_PRO_ADM}>{genConst.CONST_PRO_ADM_TXT}</MenuItem>
                      <MenuItem value={genConst.CONST_PRO_DEF}>{genConst.CONST_PRO_STU_TXT}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
                {/* <Grid item lg={6} md={6} sm={6} xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id={inputLabels.state}>{inputLabels.labelState}</InputLabel>
                    <Select
                      label={inputLabels.labelState}
                      labelId={inputLabels.state}
                      id={inputLabels.state}
                      value={formData.state}
                      onChange={handleInputChange}
                      readOnly
                    >
                      <MenuItem value={genConst.CONST_STA_ACT}>{genConst.CONST_STA_ACT_TXT}</MenuItem>
                      <MenuItem value={genConst.CONST_STA_INACT}>{genConst.CONST_STA_INACT_TXT}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                  <center>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <IconDeviceFloppy />}
                        size="large"
                        style={{ color: '#FFF', marginRight: 10 }}
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? 'Guardando...' : 'Guardar'}
                      </Button>
                      {/* {!isEdit ? (
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<IconPencil />}
                          size="large"
                          style={{ backgroundColor: genConst.CONST_UPDATE_COLOR }}
                          onClick={handleEditUser}
                        >
                          {titles.buttonUpdate}
                        </Button>
                      )} */}
                      <Button
                        variant="contained"
                        startIcon={<IconCircleX />}
                        size="large"
                        style={{ backgroundColor: genConst.CONST_CANCEL_COLOR, color: '#FFF' }}
                        onClick={handleCloseCreate}
                      >
                        {titles.buttonCancel}
                      </Button>
                    </ButtonGroup>
                  </center>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

AddUserModal.propTypes = {
  onSuccess: PropTypes.func
};
