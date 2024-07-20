package com.stockwatch.stock_watch_app.mappers;

import com.stockwatch.stock_watch_app.dao.mdb.LiveSearchStockDAO;
import com.stockwatch.stock_watch_app.dao.mdb.StockDataDAO;
import com.stockwatch.stock_watch_app.dto.response.StockInformation;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class StockInformationMapper {


    public StockInformation fromLiveSearchStockAndStockData(LiveSearchStockDAO liveSearchStockDAO, List<StockDataDAO> stockDataDAOList){
        StockInformation stockInformation= this.fromLiveSearchStock(liveSearchStockDAO);

        List<StockInformation.StockHistory> stockHistories = stockDataDAOList.stream()
                .map(this::fromStockData)
                .collect(Collectors.toList());
        stockInformation.setStockHistories(stockHistories);
        return stockInformation;
    }

    public StockInformation fromLiveSearchStock(LiveSearchStockDAO liveSearchStockDAO){
        StockInformation stockInformation = new StockInformation();
        stockInformation.setName(liveSearchStockDAO.getName());
        stockInformation.setRegion(liveSearchStockDAO.getRegion());
        stockInformation.setType(liveSearchStockDAO.getType());
        stockInformation.setSymbol(liveSearchStockDAO.getSymbol());
        stockInformation.setCurrency(liveSearchStockDAO.getCurrency());
        stockInformation.setMarketClose(liveSearchStockDAO.getMarketClose());
        stockInformation.setMarketOpen(liveSearchStockDAO.getMarketOpen());
        stockInformation.setTimestamp(liveSearchStockDAO.getTimestamp());

        return stockInformation;
    }

    public StockInformation.StockHistory fromStockData(StockDataDAO stockDataDAO){
        StockInformation.StockHistory stockHistory = new StockInformation.StockHistory();

        stockHistory.setHigh(stockDataDAO.getHigh());
        stockHistory.setLow(stockDataDAO.getLow());
        stockHistory.setOpen(stockDataDAO.getOpen());
        stockHistory.setVolume(stockDataDAO.getVolume());
        stockHistory.setPrice(stockDataDAO.getPrice());
        stockHistory.setTimestamp(stockDataDAO.getTimestamp());
        return stockHistory;
    }
}
