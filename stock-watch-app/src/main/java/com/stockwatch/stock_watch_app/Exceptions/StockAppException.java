package com.stockwatch.stock_watch_app.Exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class StockAppException extends RuntimeException{
    @Getter
    private final HttpStatus responseHttpStatus;

    public StockAppException(final String message, final HttpStatus responseHttpStatus, final Throwable cause) {
        super(message, cause);
        this.responseHttpStatus = responseHttpStatus;
    }

    public StockAppException(final String message, final HttpStatus responseHttpStatus) {
        super(message);
        this.responseHttpStatus = responseHttpStatus;
    }
}
