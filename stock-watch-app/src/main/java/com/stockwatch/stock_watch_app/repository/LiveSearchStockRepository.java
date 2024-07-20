package com.stockwatch.stock_watch_app.repository;

import com.stockwatch.stock_watch_app.dao.mdb.LiveSearchStockDAO;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LiveSearchStockRepository extends MongoRepository<LiveSearchStockDAO,String> {

    List<LiveSearchStockDAO> getLiveSearchStocksByIsEnabledIsTrue();

    Optional<LiveSearchStockDAO> getLiveSearchStockDAOBySymbol(String symbol);
}
