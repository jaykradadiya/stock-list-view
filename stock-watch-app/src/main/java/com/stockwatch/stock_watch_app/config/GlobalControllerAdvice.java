package com.stockwatch.stock_watch_app.config;

import com.stockwatch.stock_watch_app.Exceptions.StockAppException;
import com.stockwatch.stock_watch_app.dto.response.ExceptionResponseDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalControllerAdvice {

    @ExceptionHandler({ StockAppException.class})
    public ResponseEntity<ExceptionResponseDTO> tartanExceptionHandler(final StockAppException ex) {
        log.error("Stock APP exception occurred {}", ex.getMessage(),ex);
        ExceptionResponseDTO resp = new ExceptionResponseDTO(ex.getMessage());
        return new ResponseEntity<>(resp, ex.getResponseHttpStatus());
    }
}
