// Danh sách 34 tỉnh, thành phố của Việt Nam (8 thành phố trực thuộc Trung ương + 26 tỉnh)
export const MAJOR_CITIES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Hải Phòng',
  'Đà Nẵng',
  'Cần Thơ',
  'Huế',
  'Bắc Ninh',
  'Quảng Ninh'
];

export const PROVINCES_26 = [
  'An Giang',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Tĩnh',
  'Hưng Yên',
  'Khánh Hòa',
  'Lai Châu',
  'Lạng Sơn',
  'Lào Cai',
  'Lâm Đồng',
  'Nghệ An',
  'Ninh Bình',
  'Phú Thọ',
  'Quảng Ngãi',
  'Quảng Trị',
  'Sơn La',
  'Tây Ninh',
  'Thái Nguyên',
  'Thanh Hóa',
  'Tuyên Quang',
  'Vĩnh Long'
];

// Alias for backward compatibility
export const PROVINCES_28 = PROVINCES_26;

export const PROVINCES_34: string[] = [
  ...MAJOR_CITIES,
  ...PROVINCES_26
];
