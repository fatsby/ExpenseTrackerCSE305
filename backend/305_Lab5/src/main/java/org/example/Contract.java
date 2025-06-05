package org.example;

public interface Contract {
    void BuildContractID(String id); //setter
    void BuildPropertyID(String id);
    void BuildTenantID(String id);
    void BuildRentAmount(double amount);
    RentalContract SignContract(String type);//build
}