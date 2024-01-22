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

import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

const headCells = [
  {
    id: 'name',
    numeric: false,
    label: 'Professor',
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
    label: 'Would Take Again',
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
    label: 'A',
  },
  {
    id: 'bPercentage',
    numeric: true,
    label: 'B',
  },
  {
    id: 'cPercentage',
    numeric: true,
    label: 'C',
  },
  {
    id: 'dPercentage',
    numeric: true,
    label: 'D',
  },
  {
    id: 'fPercentage',
    numeric: true,
    label: 'F',
  },
  {
    id: 'numRatings',
    numeric: true,
    label: 'Number of Ratings',
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
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
  // rowCount: PropTypes.number.isRequired,
};

function EnhancedTable({ responseData }) {

  // if (!responseData) {
  //   console.error("Response data is undefined");
  //   return null; // or return an empty table or loading indicator
  // }

  // // Ensure apiData is an array
  // if (!Array.isArray(responseData)) {
  //   console.error("API data is not an array:", responseData);
  //   return null; // or handle the unexpected data structure
  // }

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const apiData = JSON.parse(responseData);

  if (!apiData.length) return;

  const dynamicRows = apiData.map((courseInfo, index) => ({
    name: courseInfo.Professor?.Name || '',
    difficulty: courseInfo.Professor?.Difficulty || '-',
    rating: courseInfo.Professor?.Rating || '-',
    wouldTakeAgain: courseInfo.Professor?.['Would Take Again'] ? `${Math.round(courseInfo.Professor?.['Would Take Again'])}%` : '-',
    gpaTerm1: `${(courseInfo.GPA?.['gpa1'] || '-')} ${(courseInfo.GPA?.['sem1'] ? `(${courseInfo.GPA?.['sem1']})` : '')}`,
    gpaTerm2: `${(courseInfo.GPA?.['gpa2'] || '-')} ${(courseInfo.GPA?.['sem2'] ? `(${courseInfo.GPA?.['sem2']})` : '')}`,
    gpaTerm3: `${(courseInfo.GPA?.['gpa3'] || '-')} ${(courseInfo.GPA?.['sem3'] ? `(${courseInfo.GPA?.['sem3']})` : '')}`,
    aPercentage: `${Math.round(courseInfo.GradesPercentage?.A)}%` || '-',
    bPercentage: `${Math.round(courseInfo.GradesPercentage?.B)}%` || '-',
    cPercentage: `${Math.round(courseInfo.GradesPercentage?.C)}%` || '-',
    dPercentage: `${Math.round(courseInfo.GradesPercentage?.D)}%`|| '-',
    fPercentage: `${Math.round(courseInfo.GradesPercentage?.F)}%` || '-',
    numRatings: courseInfo.Professor?.Num_Ratings || '-',
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
        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table
            stickyHeader
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
  responseData: PropTypes.string,
};

export default EnhancedTable;
