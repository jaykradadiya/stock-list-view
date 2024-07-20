package com.stockwatch.stock_watch_app.stockWatch;

import com.stockwatch.stock_watch_app.dao.mdb.LiveSearchStockDAO;
import com.stockwatch.stock_watch_app.dao.mdb.StockDataDAO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface StockWatchAPIProvider {

    List<LiveSearchStockDAO> searchStock(String ticker);

    StockDataDAO getStockData(String ticker);

}
