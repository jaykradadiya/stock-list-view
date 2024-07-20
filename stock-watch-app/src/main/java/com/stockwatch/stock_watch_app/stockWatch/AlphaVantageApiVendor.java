package com.stockwatch.stock_watch_app.stockWatch;

import com.stockwatch.stock_watch_app.dao.mdb.LiveSearchStockDAO;
import com.stockwatch.stock_watch_app.dao.mdb.StockDataDAO;
import com.stockwatch.stock_watch_app.utility.ApiRequestHandlerUtility;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Qualifier("AlphaVantage")
@Component
@Slf4j
public class AlphaVantageApiVendor implements StockWatchAPIProvider {

    public static final String TIME_SERIES_5_MIN = "Time Series (5min)";
    public static final String META_DATA = "Meta Data";
    public static final String TIME_ZONE = "6. Time Zone";
    public static final String OPEN = "1. open";
    public static final String HIGH = "2. high";
    public static final String LOW = "3. low";
    public static final String CLOSE = "4. close";
    public static final String VOLUME = "5. volume";
    public static final String YYYY_MM_DD_HH_MM_SS = "yyyy-MM-dd HH:mm:ss";
    @Value("${alphavantageApiKey}")
    private String apiKey;

    @Value("${alphavantageHostUrl}")
    private String hostUrl;

    private final ApiRequestHandlerUtility apiRequestHandlerUtility;

    @Autowired
    public AlphaVantageApiVendor(ApiRequestHandlerUtility apiRequestHandlerUtility) {
        this.apiRequestHandlerUtility = apiRequestHandlerUtility;
    }

    @Override
    public List<LiveSearchStockDAO> searchStock(String ticker) {
        try {
            Map<String, String> params = new HashMap<>();

            params.put("function", "SYMBOL_SEARCH");
            params.put("keywords", ticker);
            params.put("apikey", apiKey);
            params.put("datatype", "json");

            String url = hostUrl + "/query";

            JSONObject jsonObjectResponse = this.apiRequestHandlerUtility.getApiScrappingResponse(url, "GET",
                    new HashMap<>(), params, ApiRequestHandlerUtility.APPLICATION_JSON);

            if(jsonObjectResponse.has("bestMatches")){
                JSONArray bestMatches = jsonObjectResponse.optJSONArray("bestMatches",null);
                if(Objects.nonNull(bestMatches)){
                    List<LiveSearchStockDAO> liveSearchStockDAOS = new ArrayList<>();
                    for (int i = 0; i < bestMatches.length(); i++) {
                        JSONObject match = bestMatches.optJSONObject(i);
                        LiveSearchStockDAO liveSearchStockDAO = new LiveSearchStockDAO();
                        liveSearchStockDAO.setSymbol(match.optString("1. symbol"));
                        liveSearchStockDAO.setName(match.optString("2. name"));
                        liveSearchStockDAO.setType(match.optString("3. type"));
                        liveSearchStockDAO.setRegion(match.optString("4. region"));
                        liveSearchStockDAO.setMarketOpen(match.optString("5. marketOpen"));
                        liveSearchStockDAO.setMarketClose(match.optString("6. marketClose"));
                        liveSearchStockDAO.setTimestamp(match.optString("7. timezone"));
                        liveSearchStockDAO.setCurrency(match.optString("8. currency"));
                        liveSearchStockDAOS.add(liveSearchStockDAO);
                    }
                    return liveSearchStockDAOS;
                }
            }
            log.error("In AlphaVantageApiVendor -> searchStock :: could not find search result of {}",ticker);
        }
        catch (Exception e){
            log.error("In AlphaVantageApiVendor -> searchStock :: could  not get data of {}",ticker);
        }
        return null;
    }

    @Override
    public StockDataDAO getStockData(String ticker) {
        try {
            Map<String, String> params = new HashMap<>();

            params.put("function", "TIME_SERIES_INTRADAY");
            params.put("symbol", ticker);
            params.put("interval", "1min");
            params.put("apikey", apiKey);
            params.put("datatype","json");

            String url = hostUrl + "/query";

            JSONObject jsonObjectResponse = this.apiRequestHandlerUtility.getApiScrappingResponse(url, "GET",
                    new HashMap<>(), params, ApiRequestHandlerUtility.APPLICATION_JSON);

            if (jsonObjectResponse.has(TIME_SERIES_5_MIN)) {
                JSONObject metaData = jsonObjectResponse.optJSONObject(META_DATA);
                JSONObject timeSeries = jsonObjectResponse.getJSONObject(TIME_SERIES_5_MIN);
                List<StockDataDAO> stockDataDAOS = new ArrayList<>(timeSeries.length());
                String timeZone = metaData.optString(TIME_ZONE);

                for (String timestamp : timeSeries.keySet()) {
                    JSONObject data = timeSeries.getJSONObject(timestamp);
                    StockDataDAO entry = new StockDataDAO();
                    entry.setOpen(Double.parseDouble(data.optString(OPEN)));
                    entry.setHigh(Double.parseDouble(data.optString(HIGH)));
                    entry.setLow(Double.parseDouble(data.optString(LOW)));
                    entry.setPrice(Double.parseDouble(data.optString(CLOSE)));
                    entry.setVolume(Long.parseLong(data.optString(VOLUME)));
                    entry.setTimestamp(getDateFromString(timestamp, timeZone));
                    stockDataDAOS.add(entry);
                }
                stockDataDAOS.sort(Comparator.comparingLong(StockDataDAO::getTimestamp)
                        .reversed());
                return !stockDataDAOS.isEmpty() ? stockDataDAOS.get(0) : null;
            } else {
                return null;
            }
        }
        catch (Exception e){
            log.error("In AlphaVantageApiVendor -> getStockData :: could  not get data of {}",ticker);
            return null;
        }
    }


    private Long getDateFromString(String timestamp,String zone){
        LocalDateTime dateTime = LocalDateTime.parse(timestamp, DateTimeFormatter.ofPattern(YYYY_MM_DD_HH_MM_SS));
        return dateTime.atZone(ZoneId.of(zone)).toInstant().toEpochMilli();
    }

}
