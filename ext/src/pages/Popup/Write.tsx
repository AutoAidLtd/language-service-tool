import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { doFetch } from './util';
import { ChevronLeft } from '@mui/icons-material';
import langList from './lang.json';
type Props = {
  init?: any;
  reloadHandle: () => void;
  backHandle: () => void;
};
const translatePath = 'https://translate.wyvernp.id.vn';
const Write = ({ init, backHandle, reloadHandle }: Props) => {
  const mode: 'UPDATE' | 'WRITE' = useMemo(() => {
    return !!init ? 'UPDATE' : 'WRITE';
  }, [init]);
  const [list, setList] = useState<any[]>([]);
  const [key, setKey] = useState<string>();
  const [menu, setMenu] = useState<string>('common');
  const [errMsg, setMsg] = useState<string | null>();
  const [supportLanguage, setSupportLanguage] = useState<string[]>([]);
  // const [lang, setLang] = React.useState('en');

  // const handleChange = (event: SelectChangeEvent) => {
  //   setLang(event.target.value);
  // };
  useEffect(() => {
    console.log(list);
  }, [list]);
  useEffect(() => {
    fetch(translatePath + '/languages', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((rawRes) => rawRes.json())
      .then((data: any[]) => {
        const fromEnglishList = data.find((d) => d.code === 'en');
        console.log('GET SUPPORT LANGUAGES', { fromEnglishList });
        if (!!fromEnglishList) {
          setSupportLanguage(fromEnglishList?.targets ?? []);
        }
      });
  }, []);
  useEffect(() => {
    if (!!init && mode === 'UPDATE') {
      setMenu(init?.menu);
      setKey(init?.key);
      setList(
        Object.keys(init?.value).map((key) => ({
          locale: key,
          value: init.value[key],
        }))
      );
    }
  }, [init, mode]);
  const handleSubmit = () => {
    if (
      !list ||
      list.length <= 0 ||
      (list.length === 1 && !list[0].locale.trim() && !list[0].value.trim())
    ) {
      setMsg('At least 1 locale');
      return;
    }
    if (!key) {
      setMsg('Key is required');
      return;
    }
    if (!menu) {
      setMsg('Menu is required');
      return;
    }
    const value = list.reduce((prev, curr) => {
      return { ...prev, [curr.locale]: curr.value };
    }, {});
    const body = {
      key,
      menu,
      value,
    };
    console.log(body);

    doFetch('/client_language', {
      method: 'post',
      body: JSON.stringify(body),
    }).then((data) => {
      if (data.status === 'success') {
        reloadHandle?.();
      } else {
        setMsg(data?.message);
      }
    });
    setMsg(null);
  };
  return (
    <Box>
      {errMsg && (
        <Typography color="orangered" fontWeight={600} fontSize={'1.5rem'}>
          {`**${errMsg}**`}
        </Typography>
      )}
      <Box display="flex" gap="1rem">
        <IconButton onClick={() => backHandle()}>
          <ChevronLeft />
        </IconButton>
      </Box>
      <Box display={'flex'} gap="0.5rem" justifyContent="center">
        <TextField
          id="standard-basic"
          label="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          variant="standard"
        />
        <TextField
          id="standard-basic"
          label="Menu"
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
          variant="standard"
        />
      </Box>
      <Button
        onClick={() => {
          setList([...list, { locale: 'en', value: '' }]);
        }}
      >
        Add Locale Value
      </Button>
      <Box>
        <Table
          aria-label="simple table"
          sx={{
            marginBottom: '1rem',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">No.</TableCell>
              <TableCell align="center">Locale</TableCell>
              <TableCell align="center">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list?.map((row, i) => (
              <TableRow
                key={Date.now() + i}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  sx={{
                    maxWidth: 'fit-content',
                  }}
                  align="center"
                  scope="row"
                >
                  {i + 1}
                </TableCell>
                <TableCell align="center">
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={row?.locale ?? 'en'}
                    onChange={(e) => {
                      setList(
                        list.map((item, index) => {
                          if (index === i) {
                            return { ...list[i], locale: e.target.value };
                          }
                          return item;
                        })
                      );
                    }}
                    label=""
                  >
                    {Object.keys(langList).map((key) => (
                      <MenuItem value={key}>
                        {langList[key as keyof typeof langList]}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* {row.locale} */}
                </TableCell>
                <TableCell
                  align="center"
                  onBlur={(e) => {
                    console.log(e.target.innerText);
                    setList(
                      list.map((item, index) => {
                        if (index === i) {
                          return { ...list[i], value: e.target.innerText };
                        }
                        return item;
                      })
                    );
                  }}
                  contentEditable
                >
                  {row.value}
                </TableCell>
                <Button
                  onClick={async () => {
                    const enLang = list.find((l) => l.locale === 'en');
                    if (!!enLang) {
                      if (!supportLanguage.includes(row.locale)) {
                        setMsg('Language not support auto translate yet');
                      }
                      const body = {
                        q: enLang.value,
                        source: 'en',
                        target: row.locale,
                        format: 'text',
                      };
                      const translateResult = await fetch(
                        'https://translate.wyvernp.id.vn/translate',
                        {
                          method: 'post',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(body),
                        }
                      ).then((data) => data.json());
                      console.log('Translate Result ', { translateResult });
                      if (!!translateResult) {
                        setList(
                          list.map((item, index) => {
                            if (index === i) {
                              return {
                                ...list[i],
                                value: translateResult?.translatedText,
                              };
                            }
                            return item;
                          })
                        );
                      }else {
                        setMsg('Auto translate failed');
                      }
                    } else {
                      setMsg('Define english for key to use auto translate');
                    }
                  }}
                >
                  Auto
                </Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleSubmit();
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default Write;
