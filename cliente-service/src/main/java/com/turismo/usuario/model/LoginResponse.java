package com.turismo.usuario.model;

public class LoginResponse {
    private Boolean success;
    private String message;
    private Usuario usuario;
    private String token;

    public LoginResponse() {}

    public LoginResponse(Boolean success, String message, Usuario usuario, String token) {
        this.success = success;
        this.message = message;
        this.usuario = usuario;
        this.token = token;
    }

    // Getters y Setters
    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
} 