class HomeTheaterFacade {
    private DVDPlayer dvdPlayer;
    private Projector projector;
    private Amplifier amplifier;
    private Lights lights;

    // Constructor nhận các thành phần của hệ thống
    public HomeTheaterFacade(DVDPlayer dvdPlayer, Projector projector, Amplifier amplifier, Lights lights) {
        this.dvdPlayer = dvdPlayer;
        this.projector = projector;
        this.amplifier = amplifier;
        this.lights = lights;
    }

    // Phương thức đơn giản hóa để xem phim
    public void watchMovie(String movie) {
        System.out.println("Get ready to watch a movie...");
        lights.dim(10);
        projector.on();
        projector.setInput("DVD");
        amplifier.on();
        amplifier.setVolume(5);
        dvdPlayer.on();
        dvdPlayer.play(movie);
    }

    // Phương thức đơn giản hóa để tắt hệ thống
    public void endMovie() {
        System.out.println("Shutting down the home theater...");
        lights.on();
        projector.off();
        amplifier.off();
        dvdPlayer.off();
    }
}