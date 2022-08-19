
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

import { collection, query, getDocs, where } from "firebase/firestore";
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import ProjectDialog from './ProjectDialog';
import Button from '@mui/material/Button';


const columns = [
  { id: 'title', label: 'Title', minWidth: 20 },
  {
    id: 'budget',
    label: 'Budget(eth)',
    minWidth: 20,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'minimumPayment',
    label: 'Minimum Payment(eth)',
    minWidth: 20,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 20,
    align: 'left',
    format: (value) => value.toLocaleString('en-US'),
  }
];


const statusConverter = (status) => {
  switch (status) {
    case 0:
      return "Engaged";
    case 1:
      return "Not Engaged";
    case 2:
      return "Ended";
    case 3:
      return "Freelancer Completed";
    default:
      return "Client Approved";
  }
}
const ethConverter = (value) => {
  return Number(value) * 1e-18;
}

const Projects = ({ client }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [project, setProject] = React.useState({});
  const [cardOpen, setCardOpen] = React.useState(false);


  useEffect(() => doPullData(), []);

  const showProject = (data) => {
    setProject(data);
    setCardOpen(true);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const handleProjectCardClose = () => {
    setCardOpen(false);
  };

  const refresh = () => {
    doPullData();
  }

  const doPullData = async () => {
    const firebaseConfig = {
      apiKey: "AIzaSyAiM_yMTzo2fTzz1ZHnBdODIsNR0gN51_8",
      authDomain: "crypto-app-8ab81.firebaseapp.com",
      projectId: "crypto-app-8ab81",
      storageBucket: "crypto-app-8ab81.appspot.com",
      messagingSenderId: "335621362565",
      appId: "1:335621362565:web:652e94615206af2227aaec",
      measurementId: "G-D4BPHRNRG5"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    // Initialize Cloud Firestore and get a reference to the service
    const db = getFirestore(app);

    setRows([]);
    let clientAddress = client;
    clientAddress = clientAddress.toLowerCase();
    const q = query(collection(db, "projects"), where("client", "not-in", [{ clientAddress }]));

    const querySnapshot = await getDocs(q);
    let newRows = [];
    querySnapshot.forEach((doc) => {
      newRows.push({
        title: doc.data().title,
        budget: ethConverter(doc.data().budget),
        minimumPayment: ethConverter(doc.data().minimumPayment),
        status: statusConverter(doc.data().status),
        description: doc.data().description,
        client: doc.data().client,
        freelancer: doc.data().freelancer,
        id: doc.data().id,
      });
    });
    setRows(newRows);
  }


  return (
    <>
      <Title>Projects</Title>
      <Button onClick={refresh}>Refresh</Button>
      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {
                  columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ top: 0, minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover onClick={() => showProject(row)} role="checkbox" tabIndex={-1} key={row.id}>
                      {
                        columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })
                      }
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <ProjectDialog
          handleClose={handleProjectCardClose}
          data={project}
          open={cardOpen}
        />
      </Paper>
    </>
  );
}

export default Projects;