import React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { Task, getLogger, setProperty } from './ViewModel';
export type DialogResultValue = ('submit' | 'close' | 'cancel');

const logger = getLogger(`task-dialog`);

interface DialogProps {
  open: boolean;
  entity: Task;
  onClose: (result: DialogResultValue, state?: Task) => void;
}

const FormLayoutGrid = styled('div')(() => ({
  backgroundColor: 'transparent',
  height: '100%',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr',
  gridColumnGap: '15px',
  margin: '0'
}));

export function AddTaskFormDialog(props: DialogProps) {
  logger(`executing component function ...`);
  const { entity } = props;

  const onRelay = async (result: DialogResultValue) => {
    props.onClose(result, entity);
  }

  const onAcceptTextValue = (e: React.FocusEvent<any>, key: (keyof Task)) => {
    setProperty(entity, key, (e.target.value || null));
  }

  if (!entity) {
    return null;
  }

  return (
    <Dialog open={props.open} onClose={() => onRelay('close')}>
      <DialogTitle>{'Add Task'}</DialogTitle>
      <DialogContentText />
      <DialogContent>
        <FormLayoutGrid>
          <TextField onBlur={(e) => onAcceptTextValue(e, 'description')} defaultValue={entity.description} type={'text'} color='primary' autoFocus size='small' margin='dense' id='description' label='description' fullWidth variant='standard' />
        </FormLayoutGrid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onRelay('cancel')}>{'Cancel'}</Button>
        <Button type={'submit'} onClick={() => onRelay('submit')}>{'Submit'}</Button>
      </DialogActions>
    </Dialog>
  )
}