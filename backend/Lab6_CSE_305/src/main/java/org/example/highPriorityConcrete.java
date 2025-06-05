package org.example;

public class highPriorityConcrete extends requestProduct{
    public highPriorityConcrete(String priority, String expireDay, String status) {
        super(priority, expireDay, status);
    }

    @Override
    public void setExpireDay() {
        this.expireDay = expireDay;
    }

    @Override
    public void setStatus() {
        this.status = status;
    }

    @Override
    public void setPriority() {
        this.priority = priority;
    }

    @Override
    public void processRequest() {

    }
}
