import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  RefreshOutlined,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Table,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useCallback, useEffect, useState } from 'react';
import { doFetch } from './util';

type Props = {
  onCardClick?: (lang: any) => void;
  onSelectEdit?: (item: any) => void;
};

const View = ({ onCardClick, onSelectEdit }: Props) => {
  const [list, setList] = useState<any[]>();
  useEffect(() => {
    getListWord()
  }, []);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const getListWord = useCallback(()=> {
    doFetch(`/client_language?page=${page}&pageSize=${rowsPerPage}`, {
      method: 'get',
    }).then((val) => setList(val.data));
  },[page,rowsPerPage])

  useEffect(()=>{
    getListWord()
  },[page,rowsPerPage])

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Stack>
      <Box display={'flex'} width={'100%'} justifyContent={'flex-end'}>
        <IconButton onClick={()=>{
          getListWord()
        }}>
          <RefreshOutlined />
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell align="center">Menu</TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { list?.map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  sx={{
                    maxWidth: 'fit-content',
                  }}
                  scope="row"
                >
                  {row.key}
                </TableCell>
                <TableCell align="center">{row.menu}</TableCell>
                <TableCell
                  align="center"
                  sx={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {Object.keys(row.value).length > 0 &&
                    Object.keys(row.value).map((key) => (
                      <Chip label={`${key} : ${row.value[key]}`}></Chip>
                    ))}
                </TableCell>
                <TableCell>
                  <Box display={'flex'}>
                    <IconButton
                      onClick={() => {
                        if(window.confirm("Delete this row of language ? ")){

                        doFetch('/client_language?id=' + row._id, {
                          method: 'delete',
                        }).then((data) => {
                          if (data.status === 'success') {
                            getListWord()
                          }
                        });
                      }
                    }

                    }
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        onSelectEdit?.(row);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            )) ?? <>No rows</>}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={100}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {/* {list?.map((item) => {
        return (
          <Card key={item?.id || item?._id} style={{ cursor: 'pointer' }}>
            <Typography>{item?.key}</Typography>
            <Button>Update</Button>
            <Button>X</Button>
          </Card>
        );
      })} */}
    </Stack>
  );
};

export default View;
