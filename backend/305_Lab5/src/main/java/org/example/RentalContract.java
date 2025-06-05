package org.example;

public class RentalContract {
    private String conTractID;
    private double rentAmount;
    private String tenantID;
    private String propertyID;
    private String type;
    public RentalContract(String conTractID, double rentAmount, String tenantID, String propertyID, String type) {
        this.conTractID = conTractID;
        this.rentAmount = rentAmount;
        this.tenantID = tenantID;
        this.propertyID = propertyID;
        this.type = type;

    }
    public String getConTractID() {
        return conTractID;
    }
    public void setConTractID(String conTractID) {
        this.conTractID = conTractID;
    }
    public double getRentAmount() {
        return rentAmount;
    }
    public void setRentAmount(double rentAmount) {
        this.rentAmount = rentAmount;
    }
    public String getTenantID() {
        return tenantID;
    }
    public void setTenantID(String tenantID) {
        this.tenantID = tenantID;
    }
    public String getPropertyID() {
        return propertyID;
    }
    public void setPropertyID(String propertyID) {
        this.propertyID = propertyID;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Contract ID :").append(conTractID).append("\n")
                .append("Rent Amount :").append(rentAmount).append("\n")
                .append("Tenant ID :").append(tenantID).append("\n")
                .append("Property ID :").append(propertyID).append("\n")
                .append("Type :").append(type);

        return sb.toString();
    }
}
