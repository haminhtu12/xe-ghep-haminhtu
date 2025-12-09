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
    { name: 'Toyota Vios 2023', img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&h=400&fit=crop' },
    { name: 'Hyundai Accent 2023', img: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=600&h=400&fit=crop' },
    { name: 'Kia Soluto', img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop' },
    { name: 'Mitsubishi Xpander', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop' },
    { name: 'Kia Morning', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&h=400&fit=crop' },
    { name: 'Honda City', img: 'https://images.unsplash.com/photo-1580273916550-e323be2ebdd4?w=600&h=400&fit=crop' },
    { name: 'Toyota Innova', img: 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=600&h=400&fit=crop' },

    // Models observed on Vucar / Uncommon but Realistic
    { name: 'Renault Duster', img: 'https://images.unsplash.com/photo-1626245903139-2c351f7d6325?w=600&h=400&fit=crop' }, // Silver SUV
    { name: 'Ford Ranger Wildtrak', img: 'https://images.unsplash.com/photo-1574020967732-47526de59842?w=600&h=400&fit=crop' }, // Pickup
    { name: 'Mitsubishi Xforce', img: 'https://images.unsplash.com/photo-1626245903741-f6df30878c77?w=600&h=400&fit=crop' }, // White Mitsubishi SUV style
    { name: 'VinFast VF9', img: 'https://images.unsplash.com/photo-1563720223523-491937f71b96?w=600&h=400&fit=crop' }, // Large SUV
    { name: 'Ford Territory', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop' }, // Contemporary White SUV
    { name: 'Hyundai Grand i10', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&h=400&fit=crop' }, // Hatchback
];

export const LOCATIONS = [
    // Hanoi
    'Cầu Giấy, Hà Nội', 'Hoàn Kiếm, Hà Nội', 'Đống Đa, Hà Nội', 'Ba Đình, Hà Nội',
    'Hai Bà Trưng, Hà Nội', 'Thanh Xuân, Hà Nội', 'Hoàng Mai, Hà Nội', 'Long Biên, Hà Nội',
    'Nam Từ Liêm, Hà Nội', 'Bắc Từ Liêm, Hà Nội', 'Tây Hồ, Hà Nội', 'Hà Đông, Hà Nội',
    'Sóc Sơn, Hà Nội', 'Đông Anh, Hà Nội', 'Gia Lâm, Hà Nội',

    // Thanh Hoa
    'TP. Thanh Hóa, Thanh Hóa', 'Sầm Sơn, Thanh Hóa', 'Bỉm Sơn, Thanh Hóa', 'Nghi Sơn, Thanh Hóa',
    'Hoằng Hóa, Thanh Hóa', 'Quảng Xương, Thanh Hóa', 'Triệu Sơn, Thanh Hóa', 'Thọ Xuân, Thanh Hóa',
    'Ngọc Lặc, Thanh Hóa', 'Hà Trung, Thanh Hóa', 'Hậu Lộc, Thanh Hóa', 'Tĩnh Gia, Thanh Hóa',
    'Nông Cống, Thanh Hóa', 'Yên Định, Thanh Hóa', 'Thạch Thành, Thanh Hóa'
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
