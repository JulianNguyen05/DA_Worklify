package com.smartmatch.infrastructure.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims) // Đổi từ setClaims -> claims
                .subject(userDetails.getUsername()) // Đổi từ setSubject -> subject
                .issuedAt(new Date(System.currentTimeMillis())) // Đổi từ setIssuedAt -> issuedAt
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Đổi từ setExpiration -> expiration
                .signWith(getSignInKey()) // Mặc định thuật toán sẽ tự được nội suy từ SecretKey
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser() // Đổi từ parserBuilder() -> parser()
                .verifyWith(getSignInKey()) // Đổi từ setSigningKey -> verifyWith
                .build()
                .parseSignedClaims(token) // Đổi từ parseClaimsJws -> parseSignedClaims
                .getPayload(); // Đổi từ getBody() -> getPayload()
    }

    // Trả về SecretKey thay vì Key chung chung
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}