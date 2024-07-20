package com.stockwatch.stock_watch_app.repository;

import com.stockwatch.stock_watch_app.dao.mdb.StockDataDAO;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockDataRepository extends MongoRepository<StockDataDAO,String> {

    List<StockDataDAO> findTopNStockDataDAOBySymbolOrderByTimestamp(String symbol,Integer n);
}
