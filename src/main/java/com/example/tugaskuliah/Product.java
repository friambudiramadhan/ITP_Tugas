package com.example.tugaskuliah;

public class Product {
    private int productId;
    private String ProductName;
    private String ProductCode;
    private String ProductDescription;
    private int ProductPrice;
    private int ProductStock;
    private int ProductStockType;
    private String ProductImage;

    public Product(int productId, String ProductName, String ProductCode, String ProductDescription, int ProductPrice, int ProductStock, int ProductStockType, String ProductImage){
        this.productId = productId;
        this.ProductName = ProductName;
        this.ProductCode = ProductCode;
        this.ProductDescription = ProductDescription;
        this.ProductPrice = ProductPrice;
        this.ProductStock = ProductStock;
        this.ProductStockType = ProductStockType;
        this.ProductImage = ProductImage;
    }
}
