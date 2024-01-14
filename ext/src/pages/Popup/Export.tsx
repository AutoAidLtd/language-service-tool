import { Box, Button, Chip, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, Theme, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import langList from './lang.json';
import { ChevronLeft } from '@mui/icons-material';
import { doFetch, getRemoteURI } from './util';
type Props = {
    backHandle: ()=>void
}


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  

const Export = ({backHandle}: Props) => {
    const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
    // const [exportLangs, setExportLangs] = useState<string[]>([])
 
  return (
    <Stack direction={"column"} gap={2}  alignItems={"center"}>
      <Box display={"flex"} width={"100%"} justifyContent={"flex-start"}>
        <IconButton onClick={() => backHandle()}>
          <ChevronLeft />
        </IconButton>
      </Box>
        <Typography width={"100%"} textAlign="center" fontWeight={600} variant='h5'>Select languages to export</Typography>
        <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Languages</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Languages" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={langList?.[value  as keyof typeof langList]} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {Object.keys(langList).map((key) => (
            <MenuItem
              key={key}
              value={key}
            >
              {langList?.[key as keyof typeof langList ]}
            </MenuItem>
          ))}
        </Select>
        <Button
          sx={{
            mt: 2
          }}
          color="primary"
          variant="contained"
          onClick={async () => {
            
          window.location.href = getRemoteURI()+"/client_language/export?langs="+personName.join(",")

          }}
        >
          Export
        </Button>
      </FormControl>
        
    </Stack>
  )
}

export default Export