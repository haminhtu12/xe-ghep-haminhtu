export interface Driver {
    id: string;
    name: string;
    car: string;
    rating: number;
    loc: string;
    avatar: string;
    carImg: string;
}

export const FIRST_NAMES = [
    'Nam', 'Hùng', 'Tuấn', 'Dũng', 'Minh', 'Thắng', 'Đức', 'Trung', 'Hiếu', 'Hoàng',
    'Tùng', 'Sơn', 'Quân', 'Thành', 'Long', 'Hải', 'Việt', 'Cường', 'Phúc', 'Vinh',
    'Lan', 'Mai', 'Hằng', 'Thu', 'Hương'
];

export const LAST_NAMES = [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
    'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'
];

export const MIDDLE_NAMES = [
    'Văn', 'Thị', 'Đức', 'Minh', 'Hoàng', 'Thanh', 'Quang', 'Ngọc', 'Hữu', 'Xuân'
];

export const CAR_MODELS = [
    // Standard "Ordinary" Cars
    { name: 'Toyota Vios 2023', img: '/images/cars/car-1.png' },
    { name: 'Hyundai Accent 2023', img: '/images/cars/car-2.png' },
    { name: 'Kia Soluto', img: '/images/cars/car-3.png' },
    { name: 'Mitsubishi Xpander', img: '/images/cars/car-4.png' },
    { name: 'Kia Morning', img: '/images/cars/car-5.png' },
    { name: 'Honda City', img: '/images/cars/car-6.png' },
    { name: 'Toyota Innova', img: '/images/cars/car-7.png' },
    { name: 'Mazda 3', img: '/images/cars/car-8.png' },
    { name: 'Kia Cerato', img: '/images/cars/car-9.png' },
    { name: 'Hyundai Grand i10', img: '/images/cars/car-10.png' },
    { name: 'VinFast Fadil', img: '/images/cars/car-11.png' },
    { name: 'Toyota Fortuner', img: '/images/cars/car-12.png' },
    { name: 'Ford Everest', img: '/images/cars/car-13.png' },
    { name: 'Hyundai SantaFe', img: '/images/cars/car-14.png' },
    { name: 'VinFast VF8', img: '/images/cars/car-15.png' },
    { name: 'VinFast VF e34', img: '/images/cars/car-16.png' },
    { name: 'Mitsubishi Outlander', img: '/images/cars/car-17.png' },
    { name: 'Honda CR-V', img: '/images/cars/car-18.png' },
    { name: 'Mazda CX-5', img: '/images/cars/car-19.png' },
    { name: 'Kia Seltos', img: '/images/cars/car-20.png' },
    { name: 'Toyota Cross', img: '/images/cars/car-21.png' },
    { name: 'Hyundai Tucson', img: '/images/cars/car-22.png' },
    { name: 'Ford Ranger', img: '/images/cars/car-23.png' },
    { name: 'Toyota Veloz', img: '/images/cars/car-24.png' },
    { name: 'Kia Carnival', img: '/images/cars/car-25.png' },
    { name: 'Hyundai Stargazer', img: '/images/cars/car-26.png' },
];

export const LOCATIONS = [
    // Hanoi (40+ locations)
    'Cầu Giấy, Hà Nội', 'Hoàn Kiếm, Hà Nội', 'Đống Đa, Hà Nội', 'Ba Đình, Hà Nội',
    'Hai Bà Trưng, Hà Nội', 'Thanh Xuân, Hà Nội', 'Hoàng Mai, Hà Nội', 'Long Biên, Hà Nội',
    'Nam Từ Liêm, Hà Nội', 'Bắc Từ Liêm, Hà Nội', 'Tây Hồ, Hà Nội', 'Hà Đông, Hà Nội',
    'Sóc Sơn, Hà Nội', 'Đông Anh, Hà Nội', 'Gia Lâm, Hà Nội', 'Mê Linh, Hà Nội',
    'Thanh Trì, Hà Nội', 'Thường Tín, Hà Nội', 'Phú Xuyên, Hà Nội', 'Ứng Hòa, Hà Nội',
    'Mỹ Đức, Hà Nội', 'Chương Mỹ, Hà Nội', 'Thanh Oai, Hà Nội', 'Quốc Oai, Hà Nội',
    'Thạch Thất, Hà Nội', 'Hoài Đức, Hà Nội', 'Đan Phượng, Hà Nội', 'Phúc Thọ, Hà Nội',
    'Sơn Tây, Hà Nội', 'Ba Vì, Hà Nội', 'Nguyễn Trãi, Thanh Xuân', 'Láng Hạ, Đống Đa',
    'Xã Đàn, Đống Đa', 'Phố Huế, Hai Bà Trưng', 'Tràng Tiền, Hoàn Kiếm', 'Mỹ Đình, Nam Từ Liêm',
    'Cầu Diễn, Bắc Từ Liêm', 'Xuân Thủy, Cầu Giấy', 'Hoàng Quốc Việt, Cầu Giấy', 'Lạc Long Quân, Tây Hồ',
    'Âu Cơ, Tây Hồ', 'Nguyễn Văn Cừ, Long Biên', 'Ngọc Lâm, Long Biên', 'Giải Phóng, Hoàng Mai',

    // Thanh Hoa (40+ locations)
    'TP. Thanh Hóa, Thanh Hóa', 'Sầm Sơn, Thanh Hóa', 'Bỉm Sơn, Thanh Hóa', 'Nghi Sơn, Thanh Hóa',
    'Hoằng Hóa, Thanh Hóa', 'Quảng Xương, Thanh Hóa', 'Triệu Sơn, Thanh Hóa', 'Thọ Xuân, Thanh Hóa',
    'Ngọc Lặc, Thanh Hóa', 'Hà Trung, Thanh Hóa', 'Hậu Lộc, Thanh Hóa', 'Tĩnh Gia, Thanh Hóa',
    'Nông Cống, Thanh Hóa', 'Yên Định, Thanh Hóa', 'Thạch Thành, Thanh Hóa', 'Vĩnh Lộc, Thanh Hóa',
    'Thiệu Hóa, Thanh Hóa', 'Đông Sơn, Thanh Hóa', 'Nga Sơn, Thanh Hóa', 'Như Thanh, Thanh Hóa',
    'Như Xuân, Thanh Hóa', 'Thường Xuân, Thanh Hóa', 'Lang Chánh, Thanh Hóa', 'Bá Thước, Thanh Hóa',
    'Quan Hóa, Thanh Hóa', 'Quan Sơn, Thanh Hóa', 'Mường Lát, Thanh Hóa', 'Cẩm Thủy, Thanh Hóa',
    'Quảng Thành, TP. Thanh Hóa', 'Đông Vệ, TP. Thanh Hóa', 'Lam Sơn, TP. Thanh Hóa', 'Ba Đình, TP. Thanh Hóa',
    'Ngọc Trạo, TP. Thanh Hóa', 'Trường Thi, TP. Thanh Hóa', 'Điện Biên, TP. Thanh Hóa', 'Phú Sơn, TP. Thanh Hóa',
    'Nam Ngạn, TP. Thanh Hóa', 'Hàm Rồng, TP. Thanh Hóa', 'Đông Thọ, TP. Thanh Hóa', 'Quảng Hưng, TP. Thanh Hóa',
    'Quảng Phú, TP. Thanh Hóa', 'Quảng Tâm, TP. Thanh Hóa', 'Quảng Cát, TP. Thanh Hóa', 'Hải Tiến, Hoằng Hóa'
];

// Curated Asian/Vietnamese-looking avatars from Unsplash
export const MALE_AVATARS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1557862921-37829c790f19?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&fit=crop'
];

// Helper to get random item
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateDrivers = (count: number = 100): Driver[] => {
    return Array.from({ length: count }, (_, i) => {
        const firstName = getRandom(FIRST_NAMES);
        const lastName = getRandom(LAST_NAMES);
        const middleName = getRandom(MIDDLE_NAMES);
        const car = getRandom(CAR_MODELS);

        // Ensure name flow is natural
        const fullName = `${lastName} ${middleName} ${firstName}`;

        // Random rating between 4.7 and 5.0
        const rating = 4.7 + Math.random() * 0.3;

        return {
            id: `dr-${i}`,
            name: fullName,
            car: car.name,
            rating: Number(rating.toFixed(1)),
            loc: getRandom(LOCATIONS),
            avatar: getRandom(MALE_AVATARS),
            carImg: car.img
        };
    });
};
