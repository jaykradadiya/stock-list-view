package com.stockwatch.stock_watch_app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@PropertySource(value ="classpath:config/${spring.profiles.active}.properties",ignoreResourceNotFound = true)
public class StockWatcherApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockWatcherApplication.class, args);
	}

}
