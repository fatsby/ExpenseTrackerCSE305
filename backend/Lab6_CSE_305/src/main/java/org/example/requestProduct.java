package org.example;

public abstract class requestProduct {
    String priority;
    String expireDay;
    String status;
    public requestProduct(String priority, String expireDay, String status) {
        this.priority = priority;
        this.expireDay = expireDay;
        this.status = status;
    }

    public abstract void setExpireDay();

    public abstract void setStatus();

    public abstract void setPriority();
    public abstract void processRequest();
}
