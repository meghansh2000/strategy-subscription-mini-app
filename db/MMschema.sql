CREATE DATABASE strategy_subscription_app;

USE strategy_subscription_app;

CREATE TABLE strategies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    name VARCHAR(150) NOT NULL,
    
    category ENUM('Intraday', 'Positional', 'Options') NOT NULL,
    
    risk_level ENUM('Low', 'Medium', 'High') NOT NULL,
    
    min_capital DECIMAL(12,2) NOT NULL,
    
    expected_return_pct DECIMAL(5,2) NOT NULL,
    
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SHOW TABLES;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    name VARCHAR(100) NOT NULL,
    
    email VARCHAR(150) NOT NULL UNIQUE,
    
    available_capital DECIMAL(12,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DESCRIBE users;

CREATE TABLE subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    user_id INT NOT NULL,
    
    strategy_id INT NOT NULL,
    
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    status ENUM('Active', 'Paused', 'Cancelled') NOT NULL DEFAULT 'Active',
    
    allocated_capital DECIMAL(12,2) NOT NULL,
    
    CONSTRAINT fk_subscription_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_subscription_strategy
        FOREIGN KEY (strategy_id)
        REFERENCES strategies(id)
        ON DELETE CASCADE
);
DESCRIBE subscriptions;

CREATE INDEX idx_subscriptions_user_id
ON subscriptions(user_id);

CREATE INDEX idx_subscriptions_strategy_id
ON subscriptions(strategy_id);

CREATE INDEX idx_subscriptions_status
ON subscriptions(status);

INSERT INTO strategies
(name, category, risk_level, min_capital, expected_return_pct, is_active)
VALUES
('Momentum Scalper', 'Intraday', 'High', 50000, 18.50, TRUE),

('BankNifty Positional', 'Positional', 'Medium', 75000, 14.25, TRUE);

INSERT INTO users
(name, email, available_capital)
VALUES
('Meghansh M', 'meghansh@gmail.com', 200000),

('Saurabh', 'saurabh@gmail.com', 150000);

SELECT * FROM strategies;
SELECT * FROM users;
SELECT * FROM subscriptions;