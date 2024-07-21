package com.stockwatch.stock_watch_app.utility;

import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;
import okio.GzipSource;
import okio.Okio;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Component
public class ApiRequestHandlerUtility {
    public static final String APPLICATION_JSON = "application/json";
    public static final String APPLICATION_X_WWW_FORM_URLENCODED_CHARSET_UTF_8 = "application/x-www-form-urlencoded; charset=UTF-8";

    public Response getResponseFromApi(String url, String method, Map<String, String> headers,
            Map<String, String> body,String bodyType){
        log.info("In ApiRequestHandlerUtility -> getApiScrappingResponse :: API request to URL: {}",url);
        OkHttpClient.Builder okHttpClient = new OkHttpClient().newBuilder();
        OkHttpClient client = okHttpClient.build();

        Request.Builder requestBuilder = new Request.Builder().url(url);
        if("GET".equals(method)){
            log.info("In ApiRequestHandlerUtility -> getApiScrappingResponse :: Sending GET request with body: {}",body);
            requestBuilder.url(createParamString(url,body));
        }else if ("POST".equals(method) && bodyType.equals(APPLICATION_JSON)) {
            log.info("In ApiRequestHandlerUtility -> getApiScrappingResponse :: Sending POST request with body: {}",body);
            MediaType mediaType = MediaType.parse(APPLICATION_JSON);
            RequestBody requestBody = RequestBody.create(mediaType, new Gson().toJson(body, Map.class));
            requestBuilder.post(requestBody);
        } else if ("POST".equals(method) && bodyType.equals(APPLICATION_X_WWW_FORM_URLENCODED_CHARSET_UTF_8)) {
            log.info("In ApiRequestHandlerUtility -> getApiScrappingResponse :: Sending POST request with body: {}",body);
            MediaType mediaType = MediaType.parse(APPLICATION_X_WWW_FORM_URLENCODED_CHARSET_UTF_8);
            RequestBody requestBody = RequestBody.create(mediaType,createUrlEncodedBody(body));
            requestBuilder.post(requestBody);
        }
        addHeaders(requestBuilder, headers);
        Request request = requestBuilder.build();

        try {
            Response response = client.newCall(request)
                    .execute();
            log.info("In ApiRequestHandlerUtility -> getApiScrappingResponse :: API response received with status code: {}", response.code());

            return response;
        } catch (IOException e) {
            log.error("In ApiRequestHandlerUtility -> getApiScrappingResponse :: Could not execute request due to: {}", e.getMessage());
           return null;
        }
    }

    public JSONObject getApiScrappingResponse(String url, String method, Map<String, String> headers,
            Map<String, String> body,String bodyType) {
        log.info("In ApiRequestHandlerUtility -> getApiScrappingResponse :: API request to URL: {}",url);
        OkHttpClient.Builder okHttpClient = new OkHttpClient().newBuilder();
        OkHttpClient client = okHttpClient.build();

        Request.Builder requestBuilder = new Request.Builder().url(url);
        if("GET".equals(method)){
            log.info("In ApiRequestHandlerUtility -> getApiScrappingResponse :: Sending GET request with body: {}",body);
            requestBuilder.url(createParamString(url,body));
        }else if ("POST".equals(method) && bodyType.equals(APPLICATION_JSON)) {
            log.info("In ApiRequestHandlerUtility -> getApiScrappingResponse :: Sending POST request with body: {}",body);
            MediaType mediaType = MediaType.parse(APPLICATION_JSON);
            RequestBody requestBody = RequestBody.create(mediaType, new Gson().toJson(body, Map.class));
            requestBuilder.post(requestBody);
        } else if ("POST".equals(method) && bodyType.equals(APPLICATION_X_WWW_FORM_URLENCODED_CHARSET_UTF_8)) {
            log.info("In ApiRequestHandlerUtility -> getApiScrappingResponse :: Sending POST request with body: {}",body);
            MediaType mediaType = MediaType.parse(APPLICATION_X_WWW_FORM_URLENCODED_CHARSET_UTF_8);
            RequestBody requestBody = RequestBody.create(mediaType,createUrlEncodedBody(body));
            requestBuilder.post(requestBody);
        }
        addHeaders(requestBuilder, headers);
        Request request = requestBuilder.build();

        try {
            Response response = client.newCall(request)
                    .execute();
            log.info("In ApiRequestHandlerUtility -> getApiScrappingResponse :: API response received with status code: {}", response.code());
            if (isGzipped(response)) {
                response= unzip(response);
            }
            return formatResponseBody(response);
        } catch (IOException e) {
            log.error("In ApiRequestHandlerUtility -> getApiScrappingResponse :: Could not execute request due to: {}", e.getMessage());
            return new JSONObject();
        }
    }


    private void addHeaders(Request.Builder builder, Map<String, String> headers) {
        for (Map.Entry<String, String> header : headers.entrySet()) {
            builder.addHeader(header.getKey(), header.getValue());
        }
    }

    private String createParamString(String url,Map<String,String> param){
        StringBuilder stringBuilder = new StringBuilder(url);
        boolean first = true;
        if(param != null && !param.isEmpty()) {
            for (Map.Entry<String, String> entry : param.entrySet()) {
                if (!first) {
                    stringBuilder.append("&");
                } else {
                    stringBuilder.append("?");
                }
                stringBuilder.append(entry.getKey())
                        .append("=")
                        .append(entry.getValue());
                first = false;
            }
        }

        // Output the resulting string
        return stringBuilder.toString();
    }

    private String createUrlEncodedBody(Map<String,String> body){
        StringBuilder stringBuilder = new StringBuilder();
        boolean first = true;
        for (Map.Entry<String, String> entry : body.entrySet()) {
            if (!first) {
                stringBuilder.append("&");
            }
            stringBuilder.append(entry.getKey()).append("=").append(entry.getValue());
            first = false;
        }

        // Output the resulting string
        String result = stringBuilder.toString();
        return result;
    }

    private JSONObject formatResponseBody(Response response) {
        try {
            String responseBody = response.body()
                    .string();
            log.info("Response body of API response");
            log.info("In ApiRequestHandlerUtility -> formatResponseBody :: Response body of API response");
            return new JSONObject(responseBody);
        } catch (IOException e) {
            log.error("In ApiRequestHandlerUtility -> formatResponseBody :: Could not get response from request: {} {}", e.getMessage(),response.code());
            return new JSONObject();
        }
    }

    private Response unzip(final Response response) throws IOException {

        if (response.body() == null) {
            return response;
        }

        GzipSource gzipSource = new GzipSource(response.body().source());
        String bodyString = Okio.buffer(gzipSource).readUtf8();

        ResponseBody responseBody = ResponseBody.create(response.body().contentType(), bodyString);

        Headers strippedHeaders = response.headers().newBuilder()
                .removeAll("Content-Encoding")
                .removeAll("Content-Length")
                .build();
        return response.newBuilder()
                .headers(strippedHeaders)
                .body(responseBody)
                .message(response.message())
                .build();

    }

    private Boolean isGzipped(Response response) {
        return response.header("Content-Encoding") != null && response.header("Content-Encoding").equals("gzip");
    }
}
