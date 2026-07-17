package com.stayconnect.backend;

import com.stayconnect.backend.model.*;
import com.stayconnect.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private CustomerRepository customerRepository;

        @Autowired
        private HomestayRepository homestayRepository;

        @Autowired
        private RoomRepository roomRepository;

        @Autowired
        private BookingRepository bookingRepository;

        @Autowired
        private PaymentRepository paymentRepository;

        @Autowired
        private ReviewRepository reviewRepository;

        @Autowired
        private SettingsRepository settingsRepository;

        @Override
        public void run(String... args) throws Exception {
                // Seed Settings
                if (settingsRepository.count() == 0) {
                        Settings settings = Settings.builder()
                                        .systemName("StayConnect")
                                        .contactEmail("support@stayconnect.com")
                                        .currency("INR")
                                        .taxes(12.5)
                                        .bookingRules("Standard 24-hour cancelation notice. Check-in 3:00 PM, Check-out 11:00 AM. No smoking inside the premises.")
                                        .build();
                        settingsRepository.save(settings);
                }

                // Migrate old admin email if exists
                userRepository.findByEmail("stayconnect@admin.com").ifPresent(oldAdmin -> {
                        if (!userRepository.findByEmail("admin@stayconnect.com").isPresent()) {
                                oldAdmin.setEmail("admin@stayconnect.com");
                                userRepository.save(oldAdmin);
                        } else {
                                userRepository.delete(oldAdmin);
                        }
                });

                // Seed Users
                // Ensure standard admin users exist
                String[][] adminsData = {
                    {"admin@stayconnect.com", "StayConnect Admin", "u1", "admin"},
                    {"admin1@stayconnect.com", "Admin 1", "u_admin1", "admin1"},
                    {"admin2@stayconnect.com", "Admin 2", "u_admin2", "admin2"},
                    {"admin3@stayconnect.com", "Admin 3", "u_admin3", "admin3"}
                };
                for (String[] adminData : adminsData) {
                    String email = adminData[0];
                    String name = adminData[1];
                    String id = adminData[2];
                    String oldUsername = adminData[3];

                    // 1. If there's an old user with just the username (e.g. "admin1") from previous runs, update email and role
                    userRepository.findByEmail(oldUsername).ifPresent(oldUser -> {
                        if (!userRepository.findByEmail(email).isPresent()) {
                            oldUser.setEmail(email);
                            oldUser.setRole("admin");
                            userRepository.save(oldUser);
                        } else {
                            userRepository.delete(oldUser);
                        }
                    });

                    // 2. If the user with correct email exists but has wrong role, correct the role to admin
                    userRepository.findByEmail(email).ifPresent(existingUser -> {
                        if (!"admin".equals(existingUser.getRole())) {
                            existingUser.setRole("admin");
                            userRepository.save(existingUser);
                        }
                    });

                    // 3. If they don't exist at all, seed them
                    if (!userRepository.findByEmail(email).isPresent()) {
                        User adminUser = User.builder()
                                        .id(id)
                                        .email(email)
                                        .name(name)
                                        .role("admin")
                                        .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80")
                                        .status("active")
                                        .build();
                        userRepository.save(adminUser);
                    }
                }

                if (userRepository.count() <= adminsData.length) {
                        User customer1 = User.builder()
                                        .id("u2")
                                        .email("user@gmail.com")
                                        .name("John")
                                        .role("customer")
                                        .mobile("+1 (555) 123-4567")
                                        .address("123 Pine St, San Francisco, CA")
                                        .gender("Male")
                                        .status("active")
                                        .avatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80")
                                        .build();

                        User customer2 = User.builder()
                                        .id("u3")
                                        .email("jane@stayconnect.com")
                                        .name("Jane Doe")
                                        .role("customer")
                                        .mobile("+1 (555) 987-6543")
                                        .address("456 Oak Ave, Seattle, WA")
                                        .gender("Female")
                                        .status("active")
                                        .avatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80")
                                        .build();

                        userRepository.saveAll(Arrays.asList(customer1, customer2));
                }

                // Seed Customers
                if (customerRepository.count() == 0) {
                        Customer cust1 = Customer.builder()
                                        .id("u2")
                                        .name("John")
                                        .email("user@gmail.com")
                                        .mobile("+1 (555) 123-4567")
                                        .address("123 Pine St, San Francisco, CA")
                                        .gender("Male")
                                        .status("active")
                                        .createdAt("2026-05-10T10:00:00Z")
                                        .build();

                        Customer cust2 = Customer.builder()
                                        .id("u3")
                                        .name("Jane Doe")
                                        .email("jane@stayconnect.com")
                                        .mobile("+1 (555) 987-6543")
                                        .address("456 Oak Ave, Seattle, WA")
                                        .gender("Female")
                                        .status("active")
                                        .createdAt("2026-06-15T11:30:00Z")
                                        .build();

                        customerRepository.saveAll(Arrays.asList(cust1, cust2));
                }

                // Seed Homestays
                if (homestayRepository.count() == 0) {
                        Homestay h1 = Homestay.builder()
                                        .id("h1")
                                        .name("Goan Heritage Beach Villa")
                                        .address("234 Candolim Beach Road")
                                        .city("Goa")
                                        .state("Goa")
                                        .description("A luxurious heritage villa nestled along the beautiful coastline of Candolim, Goa. Enjoy panoramic Arabian Sea views, a private swimming pool, gorgeous Portuguese-style architecture, and direct private beach access.")
                                        .pricePerNight(4500.0)
                                        .amenities(Arrays.asList("Wifi", "Pool", "Ocean View", "Air Conditioning",
                                                        "Kitchen", "Free Parking", "Beach Access"))
                                        .images(Arrays.asList(
                                                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
                                                        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"))
                                        .status("active")
                                        .build();

                        Homestay h2 = Homestay.builder()
                                        .id("h2")
                                        .name("Himalayan Pine Cabin")
                                        .address("88 Kanyal Road, Simsa")
                                        .city("Manali")
                                        .state("Himachal Pradesh")
                                        .description("A cozy wood-and-stone chalet perched amidst apple orchards and towering deodar trees in Manali. Features stunning views of snow-capped Himalayan peaks, an outdoor hot tub, fireplace, and beautiful wood interiors.")
                                        .pricePerNight(3200.0)
                                        .amenities(Arrays.asList("Wifi", "Hot Tub", "Fireplace", "Mountain View",
                                                        "Heating", "Kitchen", "BBQ Grill"))
                                        .images(Arrays.asList(
                                                        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
                                                        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"))
                                        .status("active")
                                        .build();

                        Homestay h3 = Homestay.builder()
                                        .id("h3")
                                        .name("Udaipur Palace View Retreat")
                                        .address("404 Lake Pichola Waterfront")
                                        .city("Udaipur")
                                        .state("Rajasthan")
                                        .description("A majestic boutique stay right on the edge of Lake Pichola. Witness spectacular sunsets over the Lake Palace from the rooftop terrace, decorated with traditional Rajasthani jharokhas and marble carvings.")
                                        .pricePerNight(3800.0)
                                        .amenities(Arrays.asList("Wifi", "Lake Access", "Private Dock", "Kayaks",
                                                        "Patio", "Heating", "Free Parking"))
                                        .images(Arrays.asList(
                                                        "https://images.unsplash.com/photo-1615880480595-f5f9b4fb530e?auto=format&fit=crop&w=1200&q=80",
                                                        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80"))
                                        .status("active")
                                        .build();

                        Homestay h4 = Homestay.builder()
                                        .id("h4")
                                        .name("Bengaluru Garden City Loft")
                                        .address("1509 Indiranagar Double Road")
                                        .city("Bengaluru")
                                        .state("Karnataka")
                                        .description("A sophisticated, modern loft in the heart of Bengalurus premier lifestyle hub, Indiranagar. Features high-speed fiber internet, dedicated workspace, and close proximity to the citys finest cafes and breweries.")
                                        .pricePerNight(2400.0)
                                        .amenities(Arrays.asList("Wifi", "City View", "Balcony", "Workspace",
                                                        "Air Conditioning", "Washing Machine"))
                                        .images(Arrays.asList(
                                                        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                                                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"))
                                        .status("active")
                                        .build();

                        Homestay h5 = Homestay.builder()
                                        .id("h5")
                                        .name("Shimla Snow Valley Resort")
                                        .address("12 Near Mall Road")
                                        .city("Shimla")
                                        .state("Himachal Pradesh")
                                        .description("A gorgeous mountainside resort offering panoramic views of the Shimla hills and dense pine forests. Experience colonial charm combined with warm modern hospitality, cozy wooden paneling, and an outdoor fireplace.")
                                        .pricePerNight(3400.0)
                                        .amenities(Arrays.asList("Wifi", "Mountain View", "Fireplace", "Heating",
                                                        "Balcony", "Restaurant", "Free Parking"))
                                        .images(Arrays.asList(
                                                        "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=1200&q=80",
                                                        "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"))
                                        .status("active")
                                        .build();

                        Homestay h6 = Homestay.builder()
                                        .id("h6")
                                        .name("Kerala Backwaters Heritage Home")
                                        .address("56 Punnamada Lake Road")
                                        .city("Kochi")
                                        .state("Kerala")
                                        .description("A beautifully preserved 150-year-old traditional Kerala tharavadu house right on the backwaters. Enjoy floating canoe rides, traditional Ayurvedic therapies, and authentic home-cooked Kerala cuisine prepared by local hosts.")
                                        .pricePerNight(2800.0)
                                        .amenities(Arrays.asList("Wifi", "Lake View", "Ayurvedic Spa", "Kitchen",
                                                        "Free Parking", "Boating", "Air Conditioning"))
                                        .images(Arrays.asList(
                                                        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
                                                        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"))
                                        .status("active")
                                        .build();

                        Homestay h7 = Homestay.builder()
                                        .id("h7")
                                        .name("Jaipur Royal Heritage Haveli")
                                        .address("89 Amer Fort Road")
                                        .city("Jaipur")
                                        .state("Rajasthan")
                                        .description("An enchanting heritage boutique stay boasting classic Rajasthani murals, arched corridors, and central courtyards. Immerse yourself in royalty, dine under the stars with traditional folk performances, and explore Jaipur landmarks.")
                                        .pricePerNight(3500.0)
                                        .amenities(Arrays.asList("Wifi", "Pool", "Courtyard", "Air Conditioning",
                                                        "Restaurant", "Free Parking", "City View"))
                                        .images(Arrays.asList(
                                                        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
                                                        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"))
                                        .status("active")
                                        .build();

                        Homestay h8 = Homestay.builder()
                                        .id("h8")
                                        .name("Misty Mountain Tea Estate Homestay")
                                        .address("23 Tiger Hill Path")
                                        .city("Darjeeling")
                                        .state("West Bengal")
                                        .description("A charming, colonial-style cottage nestled inside a lush green tea estate. Wake up to the aroma of fresh Darjeeling tea leaves, gaze at the majestic Kanchenjunga mountain peaks, and enjoy a warm bonfire evening.")
                                        .pricePerNight(3100.0)
                                        .amenities(Arrays.asList("Wifi", "Mountain View", "Tea Garden Access",
                                                        "Fireplace", "Heating", "Balcony", "BBQ Grill"))
                                        .images(Arrays.asList(
                                                        "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
                                                        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"))
                                        .status("active")
                                        .build();

                        homestayRepository.saveAll(Arrays.asList(h1, h2, h3, h4, h5, h6, h7, h8));
                }

                // Seed Rooms
                if (roomRepository.count() == 0) {
                        Room r1 = Room.builder().id("r1").homestayId("h1").roomNumber("101").roomType("Suite")
                                        .capacity(2).price(4500.0).availability(true).build();
                        Room r2 = Room.builder().id("r2").homestayId("h1").roomNumber("102").roomType("Family")
                                        .capacity(4).price(6000.0).availability(true).build();

                        Room r3 = Room.builder().id("r3").homestayId("h2").roomNumber("201").roomType("Deluxe")
                                        .capacity(2).price(3200.0).availability(true).build();
                        Room r4 = Room.builder().id("r4").homestayId("h2").roomNumber("202").roomType("Suite")
                                        .capacity(2).price(3800.0).availability(false).build(); // Pre-booked

                        Room r5 = Room.builder().id("r5").homestayId("h3").roomNumber("301").roomType("Standard")
                                        .capacity(2).price(3800.0).availability(true).build();
                        Room r6 = Room.builder().id("r6").homestayId("h3").roomNumber("302").roomType("Suite")
                                        .capacity(4).price(5200.0).availability(true).build();

                        Room r7 = Room.builder().id("r7").homestayId("h4").roomNumber("401").roomType("Standard")
                                        .capacity(2).price(2400.0).availability(true).build();

                        Room r8 = Room.builder().id("r8").homestayId("h5").roomNumber("501").roomType("Suite")
                                        .capacity(2).price(3400.0).availability(true).build();
                        Room r9 = Room.builder().id("r9").homestayId("h5").roomNumber("502").roomType("Standard")
                                        .capacity(2).price(2200.0).availability(true).build();

                        Room r10 = Room.builder().id("r10").homestayId("h6").roomNumber("601").roomType("Deluxe")
                                        .capacity(2).price(2800.0).availability(true).build();
                        Room r11 = Room.builder().id("r11").homestayId("h6").roomNumber("602").roomType("Family")
                                        .capacity(4).price(4200.0).availability(true).build();

                        Room r12 = Room.builder().id("r12").homestayId("h7").roomNumber("701").roomType("Suite")
                                        .capacity(2).price(3500.0).availability(true).build();
                        Room r13 = Room.builder().id("r13").homestayId("h7").roomNumber("702").roomType("Deluxe")
                                        .capacity(2).price(2600.0).availability(true).build();

                        Room r14 = Room.builder().id("r14").homestayId("h8").roomNumber("801").roomType("Suite")
                                        .capacity(2).price(3100.0).availability(true).build();
                        Room r15 = Room.builder().id("r15").homestayId("h8").roomNumber("802").roomType("Standard")
                                        .capacity(2).price(1900.0).availability(true).build();

                        roomRepository.saveAll(Arrays.asList(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13,
                                        r14, r15));
                }

                // Seed Bookings
                if (bookingRepository.count() == 0) {
                        Booking b1 = Booking.builder()
                                        .id("b1")
                                        .customerId("u2")
                                        .customerName("John")
                                        .homestayId("h1")
                                        .homestayName("Goan Heritage Beach Villa")
                                        .roomId("r1")
                                        .roomNumber("101")
                                        .checkIn("2026-07-20")
                                        .checkOut("2026-07-24")
                                        .amount(18000.0)
                                        .status("confirmed")
                                        .bookingDate("2026-07-10T14:30:00Z")
                                        .build();

                        Booking b2 = Booking.builder()
                                        .id("b2")
                                        .customerId("u3")
                                        .customerName("Jane Doe")
                                        .homestayId("h2")
                                        .homestayName("Himalayan Pine Cabin")
                                        .roomId("r4")
                                        .roomNumber("202")
                                        .checkIn("2026-07-15")
                                        .checkOut("2026-07-18")
                                        .amount(11400.0)
                                        .status("completed")
                                        .bookingDate("2026-07-05T09:15:00Z")
                                        .build();

                        Booking b3 = Booking.builder()
                                        .id("b3")
                                        .customerId("u2")
                                        .customerName("John")
                                        .homestayId("h3")
                                        .homestayName("Udaipur Palace View Retreat")
                                        .roomId("r5")
                                        .roomNumber("301")
                                        .checkIn("2026-08-01")
                                        .checkOut("2026-08-04")
                                        .amount(11400.0)
                                        .status("pending")
                                        .bookingDate("2026-07-14T16:45:00Z")
                                        .build();

                        bookingRepository.saveAll(Arrays.asList(b1, b2, b3));
                }

                // Seed Payments
                if (paymentRepository.count() == 0) {
                        Payment p1 = Payment.builder().id("p1").bookingId("b1").amount(18000.0).paymentMethod("UPI")
                                        .status("Paid").paymentDate("2026-07-10T14:35:00Z").build();
                        Payment p2 = Payment.builder().id("p2").bookingId("b2").amount(11400.0)
                                        .paymentMethod("Credit Card").status("Paid").paymentDate("2026-07-18T10:00:00Z")
                                        .build();
                        Payment p3 = Payment.builder().id("p3").bookingId("b3").amount(11400.0)
                                        .paymentMethod("Credit Card").status("Pending")
                                        .paymentDate("2026-07-14T16:45:00Z").build();

                        paymentRepository.saveAll(Arrays.asList(p1, p2, p3));
                }

                // Seed Reviews
                if (reviewRepository.count() == 0) {
                        Review rev1 = Review.builder().id("rev1").homestayId("h1").customerName("Alice Johnson")
                                        .rating(5)
                                        .comment("Incredible sunset views! The private beach path was so romantic.")
                                        .date("2026-06-20").build();
                        Review rev2 = Review.builder().id("rev2").homestayId("h2").customerName("Jane Doe").rating(5)
                                        .comment("Highly recommend this cabin. The fireplace keeps you warm and the outdoor hot tub is magnificent!")
                                        .date("2026-07-18").build();
                        Review rev3 = Review.builder().id("rev3").homestayId("h1").customerName("Bob Vance").rating(4)
                                        .comment("Lovely property, super spacious rooms. Perfect for our family get-together.")
                                        .date("2026-07-01").build();

                        reviewRepository.saveAll(Arrays.asList(rev1, rev2, rev3));
                }
        }
}
