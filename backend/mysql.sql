CREATE DATABASE project3;
USE project3;
-- =====================================================================
-- 🧩 NHÓM 1: HỆ THỐNG PHÂN QUYỀN NGƯỜI DÙNG
-- =====================================================================

-- Bảng roles: Vai trò người dùng (Admin, Seller, Staff, User)
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID vai trò
    name VARCHAR(50) UNIQUE NOT NULL,            -- Tên vai trò (admin, seller, user, staff)
    description VARCHAR(255) NULL                -- Mô tả vai trò
);
select * from roles;

-- Bảng permissions: Các quyền trong hệ thống (CRUD, quản lý, duyệt,...)
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID quyền
    name VARCHAR(100) UNIQUE NOT NULL,           -- Tên quyền (vd: create_product)
    description VARCHAR(255) NULL,                -- Mô tả chi tiết quyền
    is_active BOOLEAN NULL DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
delete from permissions where id = 1;
update permissions set is_active = 1 where id=8;
select * from permissions;
-- Bảng users: Lưu thông tin tài khoản người dùng
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID người dùng
    username VARCHAR(100) NOT NULL,                  -- Họ tên
    email VARCHAR(100) UNIQUE NOT NULL,          -- Email đăng nhập
    password VARCHAR(255) NULL,                  -- Mật khẩu (NULL nếu đăng nhập social)
    provider ENUM('local','google','facebook') DEFAULT 'local', -- Nguồn đăng nhập
    provider_id VARCHAR(255) NULL,               -- ID mạng xã hội
    avatar VARCHAR(500) NULL,                    -- Ảnh đại diện
    phone VARCHAR(20) NULL,                      -- Số điện thoại
    gender ENUM('male','female','other') NULL DEFAULT 'other',   -- Giới tính
    date_of_birth DATE NULL DEFAULT '2025-12-20',                     -- Ngày sinh
    status ENUM('active','inactive','banned') DEFAULT 'active', -- Trạng thái tài khoản
    last_login DATETIME NULL,                    -- Lần đăng nhập cuối
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Thời điểm tạo tài khoản
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Thời điểm cập nhật tài khoản
);
select * from users;

DELETE from users where id = 5;
-- Bảng user_roles: Liên kết người dùng với vai trò
CREATE TABLE user_roles (
    user_id INT NOT NULL,                        -- ID người dùng
    role_id INT NOT NULL,                        -- ID vai trò
    PRIMARY KEY(user_id, role_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE
);
select * from user_roles;

-- Bảng permission_roles: Liên kết vai trò với quyền
CREATE TABLE permission_roles (
    permission_id INT NOT NULL,                  -- ID quyền
    role_id INT NOT NULL,                        -- ID vai trò
    PRIMARY KEY(permission_id, role_id),
    FOREIGN KEY(permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE
);
select * from permission_roles;
CREATE TABLE password_reset_tokens (
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  INDEX (`email`)
);
select * from  password_reset_tokens;
DELETE from password_reset_tokens where email = 'lovanthanh9124@gmail.com';

-- Bảng user_logs: Nhật ký hoạt động của người dùng
CREATE TABLE user_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                        -- Người thực hiện
    action VARCHAR(255) NOT NULL,                -- Hành động (login, update,...)
    ip_address VARCHAR(50) NULL,                 -- IP truy cập
    user_agent VARCHAR(255) NULL,                -- Trình duyệt/thiết bị
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================================
-- 🏬 NHÓM 2: CỬA HÀNG & SẢN PHẨM
-- =====================================================================

-- Bảng shops: Thông tin cửa hàng của người bán
CREATE TABLE shops (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID shop
    seller_id INT NOT NULL,                      -- ID người bán (users)
    name VARCHAR(255) NOT NULL,                  -- Tên cửa hàng
    slug VARCHAR(255) UNIQUE NOT NULL,           -- Slug (dùng cho URL)
    description TEXT NULL,                       -- Mô tả cửa hàng
    avatar VARCHAR(255) NULL,                    -- Logo hoặc ảnh shop
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng categories: Danh mục sản phẩm (đa cấp)
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID danh mục
    name VARCHAR(100) NOT NULL,                  -- Tên danh mục
    slug VARCHAR(255) UNIQUE NOT NULL,           -- Slug (URL)
    parent_id INT NULL,                          -- ID danh mục cha (nếu có)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Bảng products: Thông tin sản phẩm chính
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID sản phẩm
    shop_id INT NOT NULL,                        -- ID shop sở hữu
    category_id INT NULL,                        -- ID danh mục
    name VARCHAR(255) NOT NULL,                  -- Tên sản phẩm
    slug VARCHAR(255) UNIQUE NOT NULL,           -- Slug URL
    description TEXT NULL,                       -- Mô tả chi tiết
    price DECIMAL(10,2) NOT NULL,                -- Giá cơ bản
    status ENUM('draft', 'pending_approval', 'active', 'archived', 'banned') DEFAULT 'draft', -- Trạng thái sản phẩm
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Bảng product_variants: Các biến thể sản phẩm (size, màu,...)
CREATE TABLE product_variants (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID variant
    product_id INT NOT NULL,                     -- ID sản phẩm cha
    color VARCHAR(50) NULL,                      -- Màu sắc
    size VARCHAR(50) NULL,                       -- Kích thước
    sku VARCHAR(100) UNIQUE NOT NULL,            -- Mã SKU
    price DECIMAL(10,2) DEFAULT NULL,            -- Giá riêng cho variant
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Bảng product_images: Ảnh của sản phẩm hoặc biến thể
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID ảnh
    product_id INT NOT NULL,                     -- ID sản phẩm
    variant_id INT NULL,                         -- ID variant (nếu có)
    url VARCHAR(255) NOT NULL,                   -- Đường dẫn ảnh
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY(variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

-- Bảng product_attributes: Thuộc tính bổ sung (RAM, CPU,...)
CREATE TABLE product_attributes (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID thuộc tính
    variant_id INT NOT NULL,                     -- ID variant
    attribute_name VARCHAR(50) NOT NULL,         -- Tên thuộc tính
    attribute_value VARCHAR(50) NOT NULL,        -- Giá trị thuộc tính
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

-- =====================================================================
-- 🛒 NHÓM 3: GIỎ HÀNG, ĐƠN HÀNG & THANH TOÁN
-- =====================================================================

-- Bảng cart: Giỏ hàng của người dùng
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID giỏ hàng
    user_id INT NOT NULL UNIQUE,                 -- ID người dùng (1 giỏ / user)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng cart_items: Chi tiết sản phẩm trong giỏ hàng
CREATE TABLE cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID dòng giỏ
    cart_id INT NOT NULL,                        -- ID giỏ hàng
    product_variant_id INT NOT NULL,             -- ID variant sản phẩm
    quantity INT DEFAULT 1,                      -- Số lượng
    FOREIGN KEY(cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY(product_variant_id) REFERENCES product_variants(id)
);

-- Bảng addresses: Địa chỉ giao hàng
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID địa chỉ
    user_id INT NOT NULL,                        -- ID người dùng
    full_name VARCHAR(100) NOT NULL,             -- Tên người nhận
    phone VARCHAR(20) NOT NULL,                  -- Số điện thoại
    address_line VARCHAR(255) NOT NULL,          -- Số nhà, đường, phường
    city VARCHAR(100) NOT NULL,                  -- Tỉnh/Thành phố
    district VARCHAR(100) NOT NULL,              -- Quận/Huyện
    ward VARCHAR(100) NOT NULL,                  -- Phường/Xã
    postal_code VARCHAR(20) NULL,                -- Mã bưu điện
    is_default BOOLEAN DEFAULT FALSE,            -- Có phải địa chỉ mặc định
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng orders: Đơn hàng chính
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID đơn hàng
    customer_id INT NOT NULL,                    -- ID khách hàng
    shop_id INT NOT NULL,                        -- ID shop bán
    address_id INT NOT NULL,                     -- ID địa chỉ giao hàng
    voucher_id INT NULL,                         -- ID voucher (nếu có)
    total_amount DECIMAL(10,2) NOT NULL,         -- Tổng tiền đơn
    discount_amount DECIMAL(10,2) DEFAULT 0.0,   -- Số tiền giảm
    status ENUM('pending','confirmed','shipped','delivered','canceled','returned') DEFAULT 'pending', -- Trạng thái
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    FOREIGN KEY(address_id) REFERENCES addresses(id),
    FOREIGN KEY(voucher_id) REFERENCES vouchers(id)
);

-- Bảng order_items: Sản phẩm trong đơn hàng
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID dòng đơn hàng
    order_id INT NOT NULL,                       -- ID đơn hàng
    product_variant_id INT NULL,                 -- ID variant sản phẩm
    quantity INT NOT NULL,                       -- Số lượng
    price DECIMAL(10,2) NOT NULL,                -- Giá tại thời điểm đặt
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY(product_variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- Bảng payments: Thông tin thanh toán
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,           -- 🔑 ID thanh toán
    order_id INT NOT NULL,                       -- ID đơn hàng
    payment_method ENUM('COD','VNPAY','MOMO','BankTransfer') DEFAULT 'COD', -- Phương thức
    payment_status ENUM('pending','completed','failed') DEFAULT 'pending',  -- Trạng thái thanh toán
    amount DECIMAL(10,2) NOT NULL,               -- Số tiền
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =====================================================================
-- 🚚 NHÓM 4: VẬN CHUYỂN - KHO HÀNG - TỒN KHO
-- =====================================================================

-- Bảng shipping: Vận chuyển đơn hàng
CREATE TABLE shipping (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,                       -- ID đơn hàng
    shipping_address VARCHAR(255) NOT NULL,      -- Địa chỉ giao
    shipping_status ENUM('pending','in_transit','delivered','returned') DEFAULT 'pending', -- Trạng thái giao hàng
    tracking_number VARCHAR(100) NULL,           -- Mã vận đơn
    carrier VARCHAR(100) NULL,                   -- Đơn vị vận chuyển (GHN, GHTK,...)
    shipping_fee DECIMAL(10,2) DEFAULT 0,        -- Phí vận chuyển
    shipped_at DATETIME NULL,                    -- Ngày gửi
    delivered_at DATETIME NULL,                  -- Ngày giao
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Bảng warehouses: Kho hàng của shop
CREATE TABLE warehouses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id INT NOT NULL,                        -- ID shop sở hữu kho
    name VARCHAR(100) NOT NULL,                  -- Tên kho
    address VARCHAR(255) NOT NULL,               -- Địa chỉ kho
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- Bảng inventory: Tồn kho sản phẩm
CREATE TABLE inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_variant_id INT NOT NULL,             -- ID variant
    warehouse_id INT NULL,                       -- ID kho
    stock INT NOT NULL DEFAULT 0,                -- Số lượng tồn
    min_stock_level INT DEFAULT 0,               -- Mức cảnh báo hết hàng
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    FOREIGN KEY(warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL
);

-- =====================================================================
-- 💬 NHÓM 5: ĐÁNH GIÁ - THÔNG BÁO - TIN NHẮN
-- =====================================================================

-- Bảng reviews: Đánh giá sản phẩm
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,                     -- ID sản phẩm
    customer_id INT NOT NULL,                    -- ID người đánh giá
    rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5), -- Điểm đánh giá (1–5)
    comment TEXT NULL,                           -- Nội dung đánh giá
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(customer_id) REFERENCES users(id)
);

-- Bảng notifications: Thông báo cho người dùng
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                        -- Người nhận
    title VARCHAR(100) NOT NULL,                 -- Tiêu đề
    message TEXT NOT NULL,                       -- Nội dung thông báo
    type ENUM('order','system','voucher','chat') DEFAULT 'system', -- Loại thông báo
    is_read BOOLEAN DEFAULT FALSE,               -- Đã đọc hay chưa
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng messages: Tin nhắn giữa người dùng
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,                      -- Người gửi
    receiver_id INT NOT NULL,                    -- Người nhận
    message TEXT NOT NULL,                       -- Nội dung tin nhắn
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(receiver_id) REFERENCES users(id) ON DELETE CASCADE
);
