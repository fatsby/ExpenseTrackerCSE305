// Subsystem: DVD Player
class DVDPlayer {
    public void on() {
        System.out.println("DVD Player is ON");
    }
    public void play(String movie) {
        System.out.println("Playing movie: " + movie);
    }
    public void off() {
        System.out.println("DVD Player is OFF");
    }
}

// Subsystem: Projector
class Projector {
    public void on() {
        System.out.println("Projector is ON");
    }
    public void setInput(String input) {
        System.out.println("Projector input set to: " + input);
    }
    public void off() {
        System.out.println("Projector is OFF");
    }
}

// Subsystem: Amplifier
class Amplifier {
    public void on() {
        System.out.println("Amplifier is ON");
    }
    public void setVolume(int level) {
        System.out.println("Amplifier volume set to: " + level);
    }
    public void off() {
        System.out.println("Amplifier is OFF");
    }
}

// Subsystem: Lights
class Lights {
    public void dim(int level) {
        System.out.println("Lights dimmed to: " + level + "%");
    }
    public void on() {
        System.out.println("Lights are ON");
    }
}
