CREATE DATABASE Project3;

use Project3;

CREATE TABLE Roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE, -- admin, staff, seller, user
    description VARCHAR(255)
);
CREATE TABLE Permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE,
    description VARCHAR(255)
);


CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255), -- NULL nếu đăng nhập bằng social
    provider ENUM('local','google','facebook') DEFAULT 'local',
    provider_id VARCHAR(255) NULL, -- ID từ Google/Facebook
    avatar VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE User_Roles (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE
);

CREATE TABLE Permission_Roles (
    permission_id INT,
    role_id INT,
    PRIMARY KEY (permission_id, role_id),
    FOREIGN KEY (permission_id) REFERENCES Permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(id) ON DELETE CASCADE
);


-- Bảng danh mục sản phẩm
CREATE TABLE Categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL ,
    parent_id INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES Categories(id) ON DELETE SET NULL
);

-- Bảng sản phẩm chính
CREATE TABLE Products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL, -- liên kết với bảng Users nếu có
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(id)
    -- FOREIGN KEY (seller_id) REFERENCES Users(id) nếu bạn có bảng Users
);

-- Bảng biến thể sản phẩm (size, color, SKU, stock, giá variant)
CREATE TABLE ProductVariants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    color VARCHAR(50),
    size VARCHAR(50),
    sku VARCHAR(100) UNIQUE NOT NULL,
    stock INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT NULL, -- nếu variant có giá riêng
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

-- Bảng hình ảnh sản phẩm / variant
CREATE TABLE ProductImages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    variant_id INT NULL, -- NULL nếu ảnh chung cho sản phẩm
    url VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES ProductVariants(id) ON DELETE CASCADE
);

-- Bảng thuộc tính chi tiết của variant (ví dụ RAM, CPU, chất liệu...)
CREATE TABLE ProductAttributes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    variant_id INT NOT NULL,
    attribute_name VARCHAR(50) NOT NULL,
    attribute_value VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variant_id) REFERENCES ProductVariants(id) ON DELETE CASCADE
);
