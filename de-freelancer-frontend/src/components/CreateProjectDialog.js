import * as React from 'react';
import { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const CreateProjectDialog = ({
  handleClose,
  handleCreate,
  open
}) => {

  const [form, setForm] = useState({ title: '', description: '', budget: 0, minimumPayment: 0 });

  const handleTitleChange = (e) => {
    setForm(prevState => ({
      ...prevState,
      title: e.target.value
    }));
  }
  const handleDescChange = (e) => {
    setForm(prevState => ({
      ...prevState,
      description: e.target.value
    }));
  }
  const handleBudgetChange = (e) => {
    setForm(prevState => ({
      ...prevState,
      budget: e.target.value
    }));
  }
  const handleMinPayChange = (e) => {
    setForm(prevState => ({
      ...prevState,
      minimumPayment: e.target.value
    }));
  }


  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="standard"
            value={form.title}
            onChange={handleTitleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            variant="standard"
            value={form.description}
            onChange={handleDescChange}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Budget(in eth)"
            type="number"
            fullWidth
            variant="standard"
            value={form.budget}
            onChange={handleBudgetChange}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Minimum payment(in eth)"
            type="number"
            fullWidth
            variant="standard"
            value={form.minimumPayment}
            onChange={handleMinPayChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleCreate(form)}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateProjectDialog;