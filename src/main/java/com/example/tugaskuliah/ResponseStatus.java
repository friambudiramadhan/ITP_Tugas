package com.example.tugaskuliah;

public class ResponseStatus {
    private int StatusCode;
    private String Message;

    public ResponseStatus(int statusCode, String message){
        this.StatusCode = statusCode;
        this.Message = message;
    }
}
