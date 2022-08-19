import * as React from 'react';
import { useEffect } from "react";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button'

import logo from '../logo/de-freelancer-logo.png';
import RocketLaunch from '@mui/icons-material/RocketLaunch';
import Projects from './Projects';
import { ethers } from "ethers";
import contractAbi from "../abi-files/de-freelancer-abi.json";

import { initializeApp } from "firebase/app";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import CreateProjectDialog from './CreateProjectDialog';
import { deFreelancerContractAddress, firebaseConfig } from '../configs/Configs';



const drawerWidth = 240;
const mdTheme = createTheme();


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const Dashboard = ({ address }) => {
    const [selectedMenu, setSelectedMenu] = React.useState('Projects');
    const [db, setDb] = React.useState(null);
    const [projectFormOpen, setProjectFormOpen] = React.useState(false);

    useEffect(() => doSetupDb(), []);

    const doSetupDb = async () => {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        // Initialize Cloud Firestore and get a reference to the service
        const db = getFirestore(app);

        setDb(db);
    }

    const selectMenu = (menu) => {
        setSelectedMenu(menu);
    };

    const handleProjectFormOpen = () => {
        setProjectFormOpen(true);
    };

    const handleProjectFormClose = () => {
        setProjectFormOpen(false);
    };

    const saveProject = async (project, id) => {

        try {
            await addDoc(collection(db, "projects"), {
                id: id.toString(),
                budget: project.budget.toString(),
                client: project.client.toLowerCase(),
                minimumPayment: project.minimumPayment.toString(),
                freelancer: project.freelancer.toLowerCase(),
                status: project.status,
                title: project.title,
                description: project.description,
            });

        } catch (e) {
            console.error("Error adding document: ", e);
        }

    }

    const handleProjectCreate = async (formData) => {


        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        let deFreelancerContract = new ethers.Contract(deFreelancerContractAddress, contractAbi, signer);

        let counter = await deFreelancerContract.projectCounter();

        try {
            await deFreelancerContract.initializeProject(
                formData.title,
                formData.description,
                ethers.utils.parseEther("" + formData.budget),
                ethers.utils.parseEther("" + formData.minimumPayment),
                { value: ethers.utils.parseEther("" + formData.budget) }
            );

            deFreelancerContract.on("ProjectCreateEvent", (project) => {
                saveProject(project, counter);
            });
        }
        catch (error) {
            if (error.error !== undefined && error.error.message === "execution reverted: only registered clients can do this") {
                alert("we registered you, try again");
                deFreelancerContract.registerUser(true, address);
            }
        }

        setProjectFormOpen(false);
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer variant="permanent" open={true}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            px: [1],
                        }}
                        style={{ background: '#053359' }}
                    >
                        <Box
                            component="img"
                            sx={{
                                height: 90,
                                width: 90,
                                maxHeight: { xs: 200, md: 500 },
                                maxWidth: { xs: 200, md: 500 },
                            }}
                            alt="logo"
                            src={logo}
                        />
                    </Toolbar>
                    <List component="nav">
                        <React.Fragment>
                            <ListItemButton>
                                <ListItemIcon>
                                    <RocketLaunch />
                                </ListItemIcon>
                                <ListItemText primary="Projects" onClick={() => selectMenu("Projects")} />
                            </ListItemButton>
                        </React.Fragment>
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '200vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar>
                        <p>Your address: {address}</p>
                    </Toolbar>
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {
                                    selectedMenu === "Projects" ?
                                        <>
                                            <Button variant="contained" onClick={handleProjectFormOpen}>
                                                Start Project
                                            </Button>
                                            <CreateProjectDialog
                                                handleClose={handleProjectFormClose}
                                                handleCreate={handleProjectCreate}
                                                open={projectFormOpen}
                                            />
                                        </>
                                        : <></>
                                }
                                <Paper sx={{ m: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                                    {
                                        selectedMenu === "Projects" ?
                                            <Projects db={db} client={address} /> :
                                            <></>
                                    }

                                </Paper>
                            </Grid>
                        </Grid>

                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Dashboard;