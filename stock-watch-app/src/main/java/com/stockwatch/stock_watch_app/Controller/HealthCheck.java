package com.stockwatch.stock_watch_app.Controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@CrossOrigin
@RestController
public class HealthCheck {

    @GetMapping(Endpoints.HEALTH_CHECK)
    public String checkHealthCheck(){
        return "OK";
    }
}
