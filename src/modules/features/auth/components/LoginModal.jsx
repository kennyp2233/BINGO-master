import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    useTheme,
    CircularProgress,
    Link,
    Grid
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { authentication } from 'config/firebase';
import { createLog, getProfileUser, createDocument } from 'config/firebaseEvents';
import { genConst } from 'store/constant';
import { fullDate, generateDate } from 'utils/validations';
import { generateId } from 'utils/idGenerator';
import { collUsers } from 'store/collections';
import AnimateButton from 'components/extended/AnimateButton';
import { toast } from 'react-toastify';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import google from 'assets/images/google.webp';
import { isExistUser } from 'config/firebaseEvents';
import { Divider } from '@mui/material';

const provider = new GoogleAuthProvider();

const LoginModal = ({ open, onClose, onSuccess }) => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
    };

    const handleLoginGoogle = async () => {
        try {
            setLoading(true);
            const auth = getAuth();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userExists = await isExistUser(user.uid);
            if (!userExists) {
                const userObject = {
                    avatar: user.photoURL,
                    createAt: fullDate(),
                    email: user.email,
                    fullName: user.displayName,
                    id: user.uid,
                    name: user.displayName,
                    profile: genConst.CONST_PRO_DEF,
                    state: genConst.CONST_STATE_AC,
                    provider: 'Google'
                };
                await createDocument(collUsers, user.uid, userObject);
                toast.success('Usuario registrado correctamente!');
            }

            const uidLog = generateId(20);
            const userLog = {
                userId: user.uid,
                loginDate: fullDate(),
                email: user.email,
                state: genConst.CONST_STATE_IN,
                message: 'Inicio de sesión con Google.'
            };
            createLog(uidLog, userLog, collUsers);

            setLoading(false);
            if (onSuccess) onSuccess(user);
            onClose();
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Error al iniciar sesión con Google.');
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 2
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        name: '',
                        lastName: '',
                        phone: ''
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email('Debe ser un correo válido').max(255).required('Correo Electrónico es requerido'),
                        password: Yup.string().max(255).required('Contraseña es requerida'),
                        ...(!isLogin && {
                            name: Yup.string().max(255).required('Nombre es requerido'),
                            lastName: Yup.string().max(255).required('Apellido es requerido'),
                            phone: Yup.string().max(255).required('Teléfono es requerido')
                        })
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        setLoading(true);
                        try {
                            let user;
                            if (isLogin) {
                                const userCredencials = await signInWithEmailAndPassword(authentication, values.email, values.password);
                                user = userCredencials.user;
                            } else {
                                const userCredencials = await createUserWithEmailAndPassword(authentication, values.email, values.password);
                                user = userCredencials.user;

                                // Update profile
                                await updateProfile(user, { displayName: `${values.name} ${values.lastName}` });

                                // Create user document
                                const userObj = {
                                    id: user.uid,
                                    name: values.name,
                                    lastName: values.lastName,
                                    email: values.email,
                                    phone: values.phone,
                                    profile: genConst.CONST_PRO_DEF,
                                    state: genConst.CONST_STA_ON,
                                    createAt: generateDate(),
                                    ownReferal: generateId(8).toUpperCase()
                                };
                                await createDocument(collUsers, user.uid, userObj);
                            }

                            const uidLog = generateId(20);
                            const userLog = {
                                userId: user.uid,
                                loginDate: fullDate(),
                                email: values.email,
                                state: genConst.CONST_STATE_IN,
                                message: isLogin ? 'Inicio de sesión.' : 'Registro de usuario.'
                            };

                            createLog(uidLog, userLog, collUsers);

                            setLoading(false);
                            if (onSuccess) onSuccess(user);
                            onClose();

                        } catch (error) {
                            setLoading(false);
                            setSubmitting(false);
                            console.error(error);
                            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-login-credentials') {
                                toast.error('Credenciales incorrectas.');
                            } else if (error.code === 'auth/email-already-in-use') {
                                toast.error('El correo ya está registrado.');
                            } else if (error.code === 'auth/weak-password') {
                                toast.error('La contraseña es muy débil.');
                            } else {
                                toast.error('Error en la autenticación.');
                            }
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                {!isLogin && (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
                                                    <InputLabel htmlFor="name-signup">Nombre</InputLabel>
                                                    <OutlinedInput
                                                        id="name-signup"
                                                        value={values.name}
                                                        name="name"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        label="Nombre"
                                                    />
                                                    {touched.name && errors.name && (
                                                        <FormHelperText error>{errors.name}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth error={Boolean(touched.lastName && errors.lastName)}>
                                                    <InputLabel htmlFor="lastName-signup">Apellido</InputLabel>
                                                    <OutlinedInput
                                                        id="lastName-signup"
                                                        value={values.lastName}
                                                        name="lastName"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        label="Apellido"
                                                    />
                                                    {touched.lastName && errors.lastName && (
                                                        <FormHelperText error>{errors.lastName}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <FormControl fullWidth error={Boolean(touched.phone && errors.phone)}>
                                            <InputLabel htmlFor="phone-signup">Teléfono</InputLabel>
                                            <OutlinedInput
                                                id="phone-signup"
                                                value={values.phone}
                                                name="phone"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Teléfono"
                                            />
                                            {touched.phone && errors.phone && (
                                                <FormHelperText error>{errors.phone}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </>
                                )}

                                <FormControl fullWidth error={Boolean(touched.email && errors.email)}>
                                    <InputLabel htmlFor="email-login">Correo Electrónico</InputLabel>
                                    <OutlinedInput
                                        id="email-login"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        label="Correo Electrónico"
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error>{errors.email}</FormHelperText>
                                    )}
                                </FormControl>

                                <FormControl fullWidth error={Boolean(touched.password && errors.password)}>
                                    <InputLabel htmlFor="password-login">Contraseña</InputLabel>
                                    <OutlinedInput
                                        id="password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Contraseña"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error>{errors.password}</FormHelperText>
                                    )}
                                </FormControl>

                                <Box sx={{ mt: 2 }}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            disabled={isSubmitting || loading}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            sx={{
                                                color: '#FFF',
                                                height: 50,
                                                borderRadius: 3,
                                                position: 'relative'
                                            }}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit" /> : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                                        </Button>
                                    </AnimateButton>
                                </Box>

                                <Box sx={{ width: '100%', my: 2 }}>
                                    <Divider />
                                </Box>

                                <Button
                                    disableElevation
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    startIcon={<img src={google} alt="brand google" width={22} />}
                                    onClick={handleLoginGoogle}
                                    sx={{
                                        color: '#00adef',
                                        height: 50,
                                        borderRadius: 3,
                                        borderColor: '#e0e0e0',
                                        '&:hover': {
                                            borderColor: '#00adef',
                                            backgroundColor: 'rgba(0, 173, 239, 0.04)'
                                        }
                                    }}
                                >
                                    Inicia sesión con Google
                                </Button>

                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
                                        <Link
                                            component="button"
                                            variant="body2"
                                            onClick={toggleMode}
                                            type="button"
                                            sx={{ fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none' }}
                                        >
                                            {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
                                        </Link>
                                    </Typography>
                                </Box>
                            </Stack>
                        </form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

LoginModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func
};

export default LoginModal;
