import React from 'react';
import { Typography, TableContainer, Table, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import {StockInformation} from "./services/api.ts";

interface Props {
  stockInfo: StockInformation | null;
}

const StockDetails: React.FC<Props> = ({ stockInfo }) => {
  console.log(stockInfo)
  if (!stockInfo) {
    return <Typography variant="body1">No details available for this stock.</Typography>;
  }

  const { symbol, currency, name, timestamp, type, region, marketOpen, marketClose, stockHistories } = stockInfo;
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false, // Use 24-hour format
  })
  return (
      <div>
        <Typography variant="h5">{name} ({symbol})</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell variant="head">Currency</TableCell>
                <TableCell>{currency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Type</TableCell>
                <TableCell>{type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Region</TableCell>
                <TableCell>{region}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Market Open</TableCell>
                <TableCell>{marketOpen}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Market Close</TableCell>
                <TableCell>{marketClose}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Time</TableCell>
                <TableCell>{timestamp}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {stockHistories && stockHistories.length > 0 && (
            <div>
              <Typography variant="h6" style={{ marginTop: '20px' }}>Stock Histories</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    {stockHistories.map((history, index) => (
                        <TableRow key={index}>
                          <TableCell>Timestamp: {formattedDate.format(history.timestamp)}</TableCell>
                          <TableCell>Price: {history.price}</TableCell>
                          <TableCell>Open: {history.open}</TableCell>
                          <TableCell>High: {history.high}</TableCell>
                          <TableCell>Low: {history.low}</TableCell>
                          <TableCell>Volume: {history.volume}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
        )}
      </div>
  );
};

export default StockDetails;
