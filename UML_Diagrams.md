# Temporary Markdown file for Architecture Agreement


## Use Cases

1. Show Map:
   - Heatmap (how many people from my company passed from each toll - admin can choose to see every company separately)
   - Statistics on each toll (each company can see what other companies passed from their tolls - admin can see all)
   - Public info -> cost of toll/number of total passes
2. Show Statistics: 
   - Aggregate statistics on how many from other companies passed from our company 
   - Aggregate statistics on how many of my company passed from each of the other companies' tolls
   - Statistics on the average delay of payment from each other company
3. Invoice: 
   - Show what I owe and what I am being owed at the end of the day
   - Keep logs of past unfinished payments (to me or by me) -> 4 categories: To pay, To be paid, To validate payment, Waiting for validation by receiver
   - Check payment and validate receipt
   - Get an invoice for payment

## ER Diagram Specifics

1. Payment:
   - PayerID (Foreign key to TollOperator ID)
   - PayeeID (Foreign key to TollOperator ID)
   - Amount
   - Date
   - Date of Payment (00-00-00 for initialization)
   - Date of Validation (00-00-00 for initialization)
2. Toll:
   - ID
   - Latitude
   - Longitude
   - Road (Foreign key to Road Name)
   - OperatorID (Foreign key to TollOperator ID)
   - Prices (array with 4 cells)
3. TollOperator:
   - ID
   - Name
   - Email
   - VAT
   - Address
4. Tag:
   - TagReference
   - OperatorID (Foreign key to TollOperator ID)
5. Passes:
   - Timestamp
   - TollID (Foreign key to Toll ID)
   - TagReference (Foreign key to Tag TagReference)
   - OperatorID (Foreign key to TollOperator ID)
   - Charge  
6. Road:
   - Name
