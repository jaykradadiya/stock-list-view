package com.stockwatch.stock_watch_app.Controller;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class Endpoints {

    public static final String HEALTH_CHECK = "/healthcheck";

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static class Stock {
        public static final String BASE_URL = "/api/stoke/v1";

        public static final String STOCK_INFO = "/info/{symbol}";

        public static final String SEARCH_STOKE = "/search/{keyword}";

    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static class WatchList {
        public static final String BASE_URL = "/api/watchlist/v1";

        public static final String ADD_TO_WATCH_LIST = "/{symbol}";
        public static final String GET_WATCH_LIST = "/";
    }
}
