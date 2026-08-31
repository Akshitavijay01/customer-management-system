USE customer_management;

-- Insert sample customer data with unique customer IDs
INSERT INTO customers (customer_id, first_name, last_name, email, phone, address, city, state, postal_code, date_of_birth, gender) VALUES
('CUST-2026-0001', 'John', 'Doe', 'john.doe@email.com', '555-0101', '123 Main St', 'New York', 'NY', '10001', '1990-05-15', 'Male'),
('CUST-2026-0002', 'Jane', 'Smith', 'jane.smith@email.com', '555-0102', '456 Oak Ave', 'Los Angeles', 'CA', '90001', '1985-08-22', 'Female'),
('CUST-2026-0003', 'Michael', 'Johnson', 'michael.j@email.com', '555-0103', '789 Pine Rd', 'Chicago', 'IL', '60601', '1992-11-30', 'Male'),
('CUST-2026-0004', 'Emily', 'Williams', 'emily.w@email.com', '555-0104', '321 Elm St', 'Houston', 'TX', '77001', '1988-03-17', 'Female'),
('CUST-2026-0005', 'David', 'Brown', 'david.brown@email.com', '555-0105', '654 Maple Dr', 'Phoenix', 'AZ', '85001', '1995-07-08', 'Male'),
('CUST-2026-0006', 'Sarah', 'Davis', 'sarah.davis@email.com', '555-0106', '987 Cedar Ln', 'Philadelphia', 'PA', '19101', '1991-12-25', 'Female'),
('CUST-2026-0007', 'Robert', 'Miller', 'robert.m@email.com', '555-0107', '147 Birch Ct', 'San Antonio', 'TX', '78201', '1987-04-14', 'Male'),
('CUST-2026-0008', 'Lisa', 'Wilson', 'lisa.wilson@email.com', '555-0108', '258 Spruce Way', 'San Diego', 'CA', '92101', '1993-09-19', 'Female'),
('CUST-2026-0009', 'James', 'Moore', 'james.moore@email.com', '555-0109', '369 Willow Blvd', 'Dallas', 'TX', '75201', '1989-06-11', 'Male'),
('CUST-2026-0010', 'Jennifer', 'Taylor', 'jennifer.t@email.com', '555-0110', '741 Ash Pl', 'San Jose', 'CA', '95101', '1994-02-28', 'Female');
