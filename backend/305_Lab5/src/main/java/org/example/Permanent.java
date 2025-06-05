package org.example;

public class Permanent implements  Contract{
    private String conTractID;
    private double rentAmount;
    private String tenantID;
    private String propertyID;

    @Override
    public void BuildContractID(String id) {
        this.conTractID = id;
    }

    @Override
    public void BuildPropertyID(String id) {
        this.propertyID = id;
    }

    @Override
    public void BuildTenantID(String id) {
        this.tenantID = id;
    }

    @Override
    public void BuildRentAmount(double amount) {
        this.rentAmount = amount;
    }

    @Override
    public RentalContract SignContract(String type) {
        return new RentalContract(conTractID, rentAmount, tenantID, propertyID, type);
    }
}