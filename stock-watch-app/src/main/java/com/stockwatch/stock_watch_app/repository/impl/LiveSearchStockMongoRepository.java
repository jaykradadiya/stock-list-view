package com.stockwatch.stock_watch_app.repository.impl;

import com.stockwatch.stock_watch_app.dao.mdb.LiveSearchStockDAO;
import com.stockwatch.stock_watch_app.repository.LiveSearchStockRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class LiveSearchStockMongoRepository {
    private final LiveSearchStockRepository liveSearchStockRepository;

    public LiveSearchStockMongoRepository(LiveSearchStockRepository liveSearchStockRepository) {
        this.liveSearchStockRepository = liveSearchStockRepository;
    }

    public List<LiveSearchStockDAO> getActiveSearchList(){
        return this.liveSearchStockRepository.getLiveSearchStocksByIsEnabledIsTrue();
    }

    public LiveSearchStockDAO getStockBySymbol(String symbol){
        return this.liveSearchStockRepository.getLiveSearchStockDAOBySymbol(symbol).orElse(null);
    }

    public void updateStock(LiveSearchStockDAO liveSearchStockDAO){
        this.liveSearchStockRepository.save(liveSearchStockDAO);
    }
}
