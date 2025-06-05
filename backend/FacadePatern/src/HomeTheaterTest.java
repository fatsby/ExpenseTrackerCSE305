public class HomeTheaterTest {
    public static void main(String[] args) {
        // Khởi tạo các thành phần
        DVDPlayer dvdPlayer = new DVDPlayer();
        Projector projector = new Projector();
        Amplifier amplifier = new Amplifier();
        Lights lights = new Lights();

        // Khởi tạo Facade
        HomeTheaterFacade homeTheater = new HomeTheaterFacade(dvdPlayer, projector, amplifier, lights);

        // Sử dụng Facade để xem phim
        homeTheater.watchMovie("Inception");

        // Tắt hệ thống
        homeTheater.endMovie();
    }
}