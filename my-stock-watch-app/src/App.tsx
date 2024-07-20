import { useState, useEffect } from 'react';
import { Container, Typography, Box, Snackbar } from '@mui/material';
import StockSearch from './StockSearch';
import StockList from './StockList';
import {fetchStocks, addStock, removeStock, StockData} from './services/api';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  useEffect(() => {
    fetchInitialStocks();
  }, []);

  const fetchInitialStocks = async () => {
    try {
      const data = await fetchStocks();
      setStocks(data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setAlertMessage('Failed to fetch stocks');
      setOpenAlert(true);
    }
  };

  const handleAddStock = async (stockSymbol: string) => {
    try {
      if (stocks.some(stock => stock.symbol === stockSymbol)) {
        setAlertMessage(`Stock ${stockSymbol} is already in the watchlist.`);
        setOpenAlert(true);
        return;
      }

      const newStock= await addStock(stockSymbol);
      setStocks(prevStocks => [...prevStocks, newStock]);

      setAlertMessage(`Stock ${stockSymbol} added to watchlist.`);
      setOpenAlert(true);
    } catch (error) {
      console.error('Error adding stock:', error);
      setAlertMessage('Failed to add stock');
      setOpenAlert(true);
    }
  };

  const handleRemoveStock = async (index: number) => {
    try {
      const stockToRemove = stocks[index];
      const success = await removeStock(stockToRemove.symbol);

      if (success) {
        const updatedStocks = [...stocks];
        updatedStocks.splice(index, 1);
        setStocks(updatedStocks);

        setAlertMessage(`Stock ${stockToRemove.symbol} removed from watchlist.`);
        setOpenAlert(true);
      }
    } catch (error) {
      console.error('Error removing stock:', error);
      setAlertMessage('Failed to remove stock');
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
      <Container maxWidth="md" className="mt-5">
        <Typography variant="h4" align="center" gutterBottom>
          Stock Watchlist
        </Typography>

        <StockSearch onAddStock={handleAddStock} />

        <Box mt={4}>
          <StockList stocks={stocks} onRemoveStock={handleRemoveStock} />
        </Box>

        <Snackbar
            open={openAlert}
            autoHideDuration={4000}
            onClose={handleCloseAlert}
            message={alertMessage}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </Container>
  );
};

export default App;
