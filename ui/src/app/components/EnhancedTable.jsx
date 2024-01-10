"use client"

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Grow from '@mui/material/Grow';

const headCells = [
  {
    id: 'name',
    numeric: false,
    label: 'Professor Name',
  },
  {
    id: 'difficulty',
    numeric: true,
    label: 'Difficulty',
  },
  {
    id: 'rating',
    numeric: true,
    label: 'Rating',
  },
  {
    id: 'wouldTakeAgain',
    numeric: true,
    label: 'Would Take Again (%)',
  },
  {
    id: 'gpaTerm1',
    numeric: true,
    label: 'GPA Term 1',
  },
  {
    id: 'gpaTerm2',
    numeric: true,
    label: 'GPA Term 2',
  },
  {
    id: 'gpaTerm3',
    numeric: true,
    label: 'GPA Term 3',
  },
  {
    id: 'aPercentage',
    numeric: true,
    label: 'A (%)',
  },
  {
    id: 'bPercentage',
    numeric: true,
    label: 'B (%)',
  },
  {
    id: 'cPercentage',
    numeric: true,
    label: 'C (%)',
  },
  {
    id: 'dPercentage',
    numeric: true,
    label: 'D (%)',
  },
  {
    id: 'fPercentage',
    numeric: true,
    label: 'F (%)',
  },
  {
    id: 'numRatings',
    numeric: true,
    label: 'Number of Ratings',
  },
];

function EnhancedTableHead(props) {
  const { onRequestSort, order, orderBy } = props;

  const createSortHandler = (property) => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
          >
            <div
              onClick={() => createSortHandler(headCell.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                flexDirection: 'row-reverse',
              }}
            >
              <Grow in={orderBy === headCell.id}>
                <div style={{ marginRight: '8px' }}>
                  {order === 'desc' ? (
                    <ArrowDownwardIcon />
                  ) : (
                    <ArrowUpwardIcon />
                  )}
                </div>
              </Grow>
              {headCell.label}
            </div>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTable({ responseData }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const apiData = JSON.parse(responseData);
  const dynamicRows = apiData.map((courseInfo, index) => ({
    name: courseInfo.Professor?.Name || '',
    difficulty: courseInfo.Professor?.Difficulty || 0,
    rating: courseInfo.Professor?.Rating || 0,
    wouldTakeAgain: courseInfo.Professor?.['Would Take Again'] || 0,
    gpaTerm1: courseInfo.GPA?.['SPRING 2022'] || 0,
    gpaTerm2: courseInfo.GPA?.['SPRING 2023'] || 0,
    gpaTerm3: courseInfo.GPA?.['SUMMER 2022'] || 0,
    aPercentage: courseInfo.GradesPercentage?.A || 0,
    bPercentage: courseInfo.GradesPercentage?.B || 0,
    cPercentage: courseInfo.GradesPercentage?.C || 0,
    dPercentage: courseInfo.GradesPercentage?.D || 0,
    fPercentage: courseInfo.GradesPercentage?.F || 0,
    numRatings: courseInfo.Professor?.Num_Ratings || 0,
  }));

  const sortedRows = dynamicRows.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              onRequestSort={handleRequestSort}
              order={order}
              orderBy={orderBy}
            />
            <TableBody>
              {sortedRows.map((row, index) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={index}
                  sx={{ cursor: 'pointer' }}
                >
                  {headCells.map((cell) => (
                    <TableCell
                      key={cell.id}
                      align={cell.numeric ? 'right' : 'left'}
                    >
                      {row[cell.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

EnhancedTable.propTypes = {
  responseData: PropTypes.array,
};

export default EnhancedTable;
