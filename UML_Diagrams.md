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
   - Show what I owe and what I am owed at the end of the day
   - Keep logs of past unfinished payments (to me or by me) -> 4 categories: To pay, To be paid, To validate payment, Waiting for validation by receiver
   - Check payment and validate receipt

### Scenarios for each Use Case

User Groups: Admin (Διαχειριστής Συστήματος), Company Representative (Εκπρόσωπος εταιρείας), Anonymous User (Ανώνυμος Χρήστης)

1. Access and Update to Payment Information:
   After login, this is the home page. Can reaccess it by clicking "Payments" in the start menu
   -  Representative sees list of payments:
      - Unfiltered/Initial mode shows:  columns -> Owe, Owed, To Validate, Pending validation, Finished
      - Maximum number to show: Default 50 -> scrolling because no way they fit!!!
      - Data are only the connected payments 
      - Can filter in each column: By connected company and Date range
      - Button "Download Raw Data"
      - Button "Download Raw Data with Tags"
   - Representative chooses payment:
      - Requirement: A list with the respective payment has been loaded and shown
      - Pop-up box with information is shown
      - Information: Payer, Payee, Date, Date-of-Payment (N/A if not paid), Date-of-Verification (N/A if not verified), Action button
      - Action Button: -> hidden for Owed, Pending validation and Finished, "Validate" for To Validate, "Pay" for Owe
      /* Action Button needs to update database */
   - Admin sees list of payments:
      - Unfiltered/Initial mode shows: Pending Payment, Pending Verification, Finished
      - Can filter in each column by Payee, Payer and Date range
      - Button "Download Raw Data"
   - Admin chooses payment:
      - Requirement: A list with the respective payment has been loaded and shown
      - Pop-up box with information is shown
      - Information: Payer, Payee, Date, Date-of-Payment (N/A if not paid), Date-of-Verification (N/A if not verified)

2. Show Map:
   - Anonymous User Accesses Map:
   After login as anonymous, land on to map page
      - Ability to filter by operator
      - Clicks on toll -> Return in pop up: Name, Road, Company, Cost of toll, Average number of passes per day in the last 30 days
   - Representative Accesses Map:
     Click on "Map" from the start menu
      - Open to heat map showing where clients are
      - Clicks on toll -> Return in pop up: Name, Road, Company, Cost of toll, Average number of passes per day in the last 30 days +
        if own toll how many from other companies pass / if from other company how many of own clients pass. 
   - Admin User Accesses Map:
   Click on "Map" from the start menu
     - Ability to filter by operator
     - Clicks on toll -> Return in pop up: Name, Road, Company, Cost of toll, Average number of passes per day in the last 30 days + show how many from each company pass from the toll.
    
3. Show Statistics:
   After login, you can click on "Aggregate Statistics" from the start menu
   - Representative Accesses Statistics:
     - Initial page shows:
          1. how many from other companies passed from ours the previous day
          2. how many of our own passed from each of the other companies in the previous day 
          3. average delay of payment from each company in the last 30 days
          4. Aggregate of unpaid payments to me and by me (separate for each other company)
     - For each of the previous cases can filter which companies to include, date range and for the second one which specific tolls to include

   - Admin Accesses Statistics:
     - Initial page shows:
          1. Dependency Chart on passes (last day)
          2. Dependency Chart on debt (current)
     - For each of the previous cases can filter which companies to include and date range
     - Can choose to show any of the diagrams that a representative would see by choosing "Rep Company", then any of the filters a rep has and which diagram from the 4 they want

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
