export interface Driver {
    id: string;
    name: string;
    car: string;
    rating: number;
    loc: string;
    avatar: string;
    carImg: string;
}

const FIRST_NAMES = [
    'Nam', 'Hùng', 'Tuấn', 'Dũng', 'Minh', 'Thắng', 'Đức', 'Trung', 'Hiếu', 'Hoàng',
    'Tùng', 'Sơn', 'Quân', 'Thành', 'Long', 'Hải', 'Việt', 'Cường', 'Phúc', 'Vinh',
    'Lan', 'Mai', 'Hằng', 'Thu', 'Hương'
];

const LAST_NAMES = [
    'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
    'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'
];

const MIDDLE_NAMES = [
    'Văn', 'Thị', 'Đức', 'Minh', 'Hoàng', 'Thanh', 'Quang', 'Ngọc', 'Hữu', 'Xuân'
];

const CAR_MODELS = [
    { name: 'Toyota Vios 2022', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop' },
    { name: 'Hyundai Accent 2023', img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop' },
    { name: 'Kia Cerato 2022', img: 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=600&h=400&fit=crop' },
    { name: 'Mitsubishi Xpander', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop' },
    { name: 'VinFast VF5', img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop' },
    { name: 'Mazda 3 2023', img: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop' },
    { name: 'Honda City', img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&h=400&fit=crop' },
];

const LOCATIONS = [
    'Ngã Tư Sở, Hà Nội', 'BigC Thanh Hóa', 'Giáp Bát, Hà Nội', 'Sầm Sơn, Thanh Hóa',
    'Mỹ Đình, Hà Nội', 'Quảng Xương, Thanh Hóa', 'Long Biên, Hà Nội', 'Bỉm Sơn, Thanh Hóa',
    'Hà Đông, Hà Nội', 'Hoằng Hóa, Thanh Hóa', 'Hai Bà Trưng, Hà Nội', 'Tĩnh Gia, Thanh Hóa'
];

// Curated Asian/Vietnamese-looking avatars from Unsplash
const MALE_AVATARS = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', // classic
    'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop', // young
    'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop', // glasses
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', // smiling
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop', // friendly
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', // portrait
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', // intent
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', // cool
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
