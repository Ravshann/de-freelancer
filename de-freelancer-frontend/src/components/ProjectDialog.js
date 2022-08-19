import * as React from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

const ProjectDialog = ({
    handleClose,
    data,
    open
}) => {
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    {data !== undefined ? <Typography><b>Title:</b> {data.title}</Typography> : <></>}
                    {data !== undefined ? <Typography><b>Description:</b><br/> {data.description}</Typography> : <></>}
                    
                    {data !== undefined ? <Typography><b>Budget(eth):</b> {data.budget}</Typography> : <></>}
                    {data !== undefined ? <Typography><b>Minimum Payment(eth):</b> {data.minimumPayment}</Typography> : <></>}
                    {data !== undefined ? <Typography><b>Status:</b> {data.status}</Typography> : <></>}
                    <br/>
                    {data !== undefined ? <Typography><b>Client:</b> {data.client}</Typography> : <></>}
                    {data !== undefined ? <Typography><b>Freelancer:</b> {data.freelancer}</Typography> : <></>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>End Project</Button>
                    <Button onClick={handleClose}>Propose</Button>
                    <Button onClick={handleClose}>Complete</Button>
                    <Button onClick={handleClose}>Accept Work</Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProjectDialog;