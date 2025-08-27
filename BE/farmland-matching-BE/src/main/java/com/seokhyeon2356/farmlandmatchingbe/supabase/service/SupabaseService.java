package com.seokhyeon2356.farmlandmatchingbe.supabase.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class SupabaseService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon-key}")
    private String supabaseApiKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    private final RestTemplate restTemplate = new RestTemplate();

    public String uploadFile(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String safeName = URLEncoder.encode(file.getOriginalFilename(), StandardCharsets.UTF_8);
        String fileName = System.currentTimeMillis() + "_" + safeName;

        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

        String contentType = file.getContentType();
        if (contentType == null || contentType.isEmpty()) {
            contentType = "application/octet-stream";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.setBearerAuth(supabaseApiKey);
        headers.set("apikey", supabaseApiKey);

        HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);
        ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.POST, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + fileName;
        } else {
            throw new RuntimeException("Supabase 업로드 실패: " + response.getStatusCodeValue() + " - " + response.getBody());
        }
    }

    public void delete(String landImage) {
    }
}
