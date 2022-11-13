import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import { CenteredVerticalFlexGrid } from '../../shared/layout/flex';
import { Task, TransitionName, getLogger } from './ViewModel';

const logger = getLogger(`task-card-listview`);

type CardViewProps = { 
  entity: Task, 
  onEvent: (eventName: TransitionName, data: any) => void 
};

function CardView({ entity, onEvent }: CardViewProps) {
  logger(`component function invoked (vm:=${JSON.stringify(entity)})`);

  return (
    <Card sx={{ minWidth: 275, margin: '5px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          {`task: ${entity.uuid}`}
        </Typography>
        <Typography variant='h5' component='div'>
          {entity.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small' onClick={() => onEvent('mark-complete', entity)} >complete</Button>
      </CardActions>
    </Card>
  );
}

type CardListViewProps = { 
  entities: Task[], 
  onEvent: (eventName: TransitionName, data: any) => void 
}

export function CardListView({ entities, onEvent }: CardListViewProps) { 
  const hasCards = ((entities || []).length > 0);

  if (hasCards) {
    const content = entities.map((entity) => {
      return <CardView key={entity.uuid} entity={entity} onEvent={onEvent} />
    });

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={5}>
          {content}
        </Grid>
      </Box>
    );
  }

  return (
    <Grow in={true} timeout={1000}>
      <CenteredVerticalFlexGrid>
        <Typography variant='h5' component='div'>{'Tasks completed!'}</Typography>
      </CenteredVerticalFlexGrid>
    </Grow>
    
  )
}