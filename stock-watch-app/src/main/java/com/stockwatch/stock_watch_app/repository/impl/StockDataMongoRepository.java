package com.stockwatch.stock_watch_app.repository.impl;

import com.stockwatch.stock_watch_app.dao.mdb.StockDataDAO;
import com.stockwatch.stock_watch_app.repository.StockDataRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StockDataMongoRepository {
    private StockDataRepository stockDataRepository;

    public StockDataMongoRepository(StockDataRepository stockDataRepository) {
        this.stockDataRepository = stockDataRepository;
    }

    public void saveStokeData(StockDataDAO dataDAO){
        this.stockDataRepository.save(dataDAO);
    }

    public List<StockDataDAO> getTopNResultOfSymbol(String symbol,Integer n){
        return this.stockDataRepository.findTopNStockDataDAOBySymbolOrderByTimestamp(symbol,n);
    }

}
