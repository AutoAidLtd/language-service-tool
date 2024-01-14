import {
  Box,
  Button,
  Card,
  IconButton,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import './Popup.css';
import { getRemoteURI } from './util';
import useInit from './hooks/useInit';
import View from './View';
import Write from './Write';
import { RefreshOutlined } from '@mui/icons-material';
import Export from './Export';
type Mode = 'view' | 'create' | 'update' | 'export';

const Popup = () => {
  const [mode, setMode] = useState<Mode>('view');
  const { types } = useInit();
  const [tab, setTab] = useState<any>('client_lang');
  const [editItem, setEditItem] = useState(null);
  
  useEffect(() => {
    if (types && types[0]) {
      console.log(types[0]?.value);

      setTab(types[0]?.value);
    }
  }, [types]);
  useEffect(() => {
    console.log(tab);
  }, [tab]);
  return (
    <div className="App">
      <Box
        component={'div'}
        sx={{
          padding: '1rem 2rem',
        }}
      >
        <Typography color={'black'} fontSize={'1.5rem'} fontWeight={600}>
          Language Manage Tool
        </Typography>
      </Box>
      <Tabs
        value={tab}
        onChange={(e, val) => {
          console.log('Tab change', val);
          setTab(val);
        }}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        {types?.map((type: any, i: number) => (
          <Tab label={type.label} key={i} value={type.value} />
        ))}
      </Tabs>
      <Box display="flex" justifyContent="flex-end" gap={2} margin={'1rem'}>
        <Button
         
          color="primary"
          variant="contained"
          onClick={() => {
            setMode('create');
          }}
        >
          Add
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            setMode('export');
          }}
        >
          Export
        </Button>
      </Box>
      {mode === 'view' && (
        <View
          onSelectEdit={(item) => {
            setEditItem(item);
            setMode('update');
          }}
        />
      ) }
      {mode === 'create' && (
        <Write
          init={editItem}
          backHandle={() => {
            setMode('view');
            setEditItem(null);
          }}
          reloadHandle={() => {
            setEditItem(null);
            setMode('view');
          }}
        />
      )}
      {mode === 'export' && (
        <Export
        backHandle={() => {
          setMode('view');
          setEditItem(null);
        }}
        />
      )}
      <Box
        sx={{
          pb: '3rem',
        }}
      />
    </div>
  );
};

export default Popup;
