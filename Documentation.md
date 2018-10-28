# HOSPITAL RUN DOCUMENTATION #
****
The following is a comprehensive documentation for the Hospital Run user interface.
## 1. INVENTORY ##
The inventory module integrates with all other modules in Hospital Run making inventory management a walk in the park. For example; the store manager can input supplies, when the pharmacy dispenses of some medicine there is an upgrade on the inventory level. Many other authorized users can also make interactions with the inventory to have a synchronized inventory management system.  Now we will dive into the specifics of each sub-menu item:

----------
#### 1.1 ITEM ####
----------
This although on the second sub-menu is where you want to begin when working on a new item.Please note that you need items inputted in this section so that you can be able to add inventory in the specific item. 

Click new item and field appear as follows:

**Name**: This is the name of the Inventory Item e.g. Panadol

**Rank**: The relative position, value, worth of the object.

**Description**: This is the explanation of what the item does and its descriptive features.

**Type**: This is a mandatory field, It is a drop-down menu that categorizes the type of item, this menu can be adjusted in the Look-up Lists in the Administration menu under "Inventory Type." e.g. Supply or Medicine
	
**Cross Reference**: This is a reference to type dialog that is given to elaborate it more.

**Re-Order Point**: This is inputted by the inventory manager in order for them to know when it is time to reorder the inventory.

**Sale Price per Unit**: This is the selling price of the new inventory item.	

**Distribution Unit**: This is a mandatory field, It is a drop-down menu for the unit of the item and can be set in the unit menu in the look up lists.
	


If there the item has already been purchased and we have some inventory we can move on the the next section that corresponds to the inventory received menu.

--------------------------------
Purchase Information Section
--------------------------------

**Date Received**: The date when the inventory was received by the Facility.

**Invoice Number**: This is the Vendor's Invoice number.


**Quantity**: Shows the quantity of the item as input in the received inventory.

**Unit**: This is the unit of the item and can be set in the unit menu in the look up lists.

**Vendor**: This is a mandatory field, the vendor of the inventory item can be added from a drop-down in the Administration menu under "Vendor."

**Vendor Item number**: This is the number given to the item by the vendor.

**Location**: This is the location of the item inventory.

**Aisle Location**: Incase the Facility has varied aisles to receive inventory it may be important to specify which of the aisles the inventory was delivered to. This Drop-down menu can be adjusted in the Look-up Lists in the Administration menu under "Inventory Aisle Locations."

**Gift in Kind(Check Box)**: If the inventory was received as an in-kind gift indicate here.

You can then Add the item and its corresponding inventory or cancel the item with the corresponding buttons.


*After you save, the new item will appear in the item sub-menu as rows per item with columns that read as follows:*



**ID**: Identification number of the item.

**Name**: This is the name of the Inventory Item as input in the received inventory or new item dialog boxes.

**Type**: This is the type of item in the inventory as input in the received inventory or new item dialog boxes.

**Quantity**: Shows the quantity of the item as input in the received inventory or new item dialog boxes.

**Location**: This is the location of the inventory as input in the received inventory or new item dialog boxes.

**XRef**:its a reference/connection to an item.

+ Actions: This is where you can;

	- **Add**; This is where you can input new inventory to that specific row item, it opens a dialog box where you can input this information.
	- **Edit**: Here you edit the details of the item, you can as well see the purchase history, add a purchase, locations of the inventory, transfer the inventory and all the transactions happening in the other modules regarding the specific inventory item.
	- **Delete**; You can use this button to delete that row item.
	- **Barcode**: This is the system generated unique barcode for your item.
----------
#### 1.2 INVENTORY RECEIVED ####
----------

Once you click on the inventory received sub-menu you can see items in your current inventory. The fields are as follows:
	
 ### Top Menu ###

**Date Received**: The date when the inventory was received by the Facility.

**Vendor**: This is a mandatory field, the vendor of the inventory item can be added from a drop-down in the Administration menu under "Vendor."
	
**Invoice Number**: This is the Vendor's Invoice number.

	
**Location**: This field is for Facilities that have several branches where it is important to track which of the branches the inventory was delivered to.This Drop-down menu can be adjusted in the Look-up Lists in the Administration menu under "Inventory Locations."

	
**Aisle Location**: Incase the Facility has varied aisles to receive inventory it may be important to specify which of the aisles the inventory was delivered to. This Drop-down menu can be adjusted in the Look-up Lists in the Administration menu under "Inventory Aisle Locations."

**Gift in Kind(Check Box)**: If the inventory was received as an in-kind gift indicate here.



## Invoice Line Item #

**Inventory Item**: This is a mandatory field, that takes the name of the Item already in the system.

**Quantity**: Describes the quantity of the item.

**Unit**: This is the specific unit of the new item, It is a drop-down menu that categorizes the type of item, this menu can be adjusted in the Look-up Lists in the Administration menu under "Unit Types."In this page it is already input in the item page before and therefore is not editable here. If you would like to edit it just go back and do so in the item list.

**Purchase Cost**: This is the buying price of the new inventory item.
	
**Vendor Item number**: This is the number given to the item by the vendor.

**Serial/Lot number**: This is an identification number assigned to a particular quantity or lot of material from a single manufacturer.

**Expiration Date**: The expiration date of the new item.

+Add button adds this information to your item list
+You can as well cancel or save your new inventory entry details using the corresponding buttons.

If the item is not already in the system a new dialog box appears for you to provide more information about this new item:

### New Dialog Box###

**Name**: This is a mandatory field, that takes the name of the new inventory Item.

**Rank**: The relative position, value, worth of the object.

**Description**: This is the explanation of what the item does and its descriptive features.

**Type**: This is a mandatory field, It is a drop-down menu that categorizes the type of item, this menu can be adjusted in the Look-up Lists in the Administration menu under "Inventory Aisle Locations."
	
**Cross Reference**: This is a reference to type dialog that is given to elaborate it more.

**Re-Order Point**: This is inputted by the inventory manager in order for them to know when it is time to reorder the inventory.

**Sale Price per Unit**: This is the selling price of the new inventory item.	

**Distribution Unit**: This is the unit of the item and can be set in the unit menu in the look up lists as described before.

After you save now the new item will appear in the item sub-menu whose attributes are described in the next *ITEM* description.
	


----------
#### 1.3 REQUESTS ####
----------
**Name**: Describes the name of the Inventory Item requested.

**Quantity**: Describes the quantity of the number of items requested.

**Requested on**: Shows the date the item was requested.

**Requested by**: Shows the user who requested for the item.

+ Actions: This is where you can fulfill or delete the request

You could use the tabs on the right to either request or add inventory. Let us go in detail into the new request module:

**Inventory Item**: Here you select an already existing or new item. If there exists some inventory this will show you how many are remaining so that you can make a decision on how many to add.

**Quantity**: Describes the quantity of the items you want to add.

+, this plus sign enables you to make multiple requests at once

**Requested on**: Shows the date the item was requested.

**Requested by**: Shows the Individual who requested for the item.

**Delivery Location**: This is the location where the inventory should be delivered.

**Delivery Aisle **: Incase the Facility has varied aisles to receive inventory it may be important to specify which of the aisles the inventory is to be delivered to. 

**Bill to **: Which section of the hospital will bear the expense of the inventory

**Mark as consumed(Box to tick)**: If new item is being ordered leave unticked, if it is a consumed product that was initially in the inventory list tick so that it can be indicated they have been consumed.

----------
#### 1.4 REPORTS ####
----------

#### Report Type ####

- **Days supply left in stock :** Helps the user generate a report of the supplies left in stock, the feature has useful feature such as the when the consumption rate and and days fields are toggled. It can track the usage history and compare it with the inventory level and can generate how many days are left to refill your stock.
- **Detailed Adjustment** : subtle changes to the report of the item.
- **Detailed Purchase :**Shows a detailed report of the item purchased within the time range keyed in
- **Detailed Stock Usage :**Shows a detailed report of the stock used from the inventory within the time range keyed in********
- **Detailed Stock Transfer :** Gives a detailed report of the stocks transferred from one inventory store to another within the time range keyed in
-** Detailed Expenses :** Gives a detailed report on all expenses incurred in purchase of stock in the inventory
- **Expiration Date :** Gives a detailed report on all the expiration dates of the stock in the inventory
- **Inventory by Location :** Gives a detailed report on all the inventory per location, in the case of multiple locations
- **Inventory Valuation :** The valuation of all your inventory
- **Summary Expenses :** Creates a report on all the stock consumed, donated in kind and that which can no longer be used to to factors such as expiry. 
- **Summary Purchase :** Summary of what has been purchased over a certain period of time.
- **Summary Stock Usage :** Summary of the stock that has been used over a certain period of time.
- **Summary Stock Transfer :** Summary of the stock that has been transferred from one facility inventory location/store to another over a certain period
-**Finance Summary :** A financial summary of all the transactions within a specified period
#### Location ####
Is where you indicate the location of the inventory query that you would like to make.
#### Start and End Date ####
Is the range within which you would like to query the inventory activity
#### Fields to Include ####
This are the field in your inventory that you want the command to query.

**Generate Report Button:**  This button when clicked runs the command to generate the report that is viewed in the render below the search header.

**Export Report Button:** This button exports the report to an excel sheet in the users preferred export location.

 
## 2. PATIENTS ##

The patient module manages all information regarding the outpatient and inpatient activity of patients visiting the facility. It interacts with other modules to provide information to other modules such as lab, Imaging and billing etc. It is only people with permission to view the module who are able to do so.

----------
#### 2.1 NEW PATIENT ####
----------
Although this is the fourth sub-menu this is where you want your entry point to be in a new instance. When you click on it a new page is rendered with the following dialogs:


**General Patient Details(First, Middle, Family names, Sex, Date of Birth, Age, Place of Birth, Occupation etc.)**: These are the general details of the patient that you want to key into the system.

After filling in the Details of the patient click on the add button to register the patient in the system.A new page is rendered with the following information:


**Name**: Shows the name of the patient.

**Primary Diagnosis**: This is the diagnosis of the patient by the clinician.

**Operative plan**: This is the operation plan if the patient is to undergo an operation procedure. 

**Patient allergies**: The type of allergies the patient has.

**History**:This is includes any current or past information of the patient. Under this module click 

**General**: This is where you fill in the basic information about the patient.

**Photos**: This is where you provide the image of the patient.you can use a web cam to take a photo or upload a file from the computer.

**Appointments**: This allows to see the appointments that the patient might have.

**Visit**: This is shows you all the visits the patient has done since registering in the hospital.it includes the date, diagnosis, location , type of the visit and who helped the patient out. Click on the New visit button to begin. When you click on it a new page is rendered with the following dialogs: 



- **Name**: Shows the name of the patient.
- 
**Primary Diagnosis**: This is the diagnosis of the patient by the clinician.
- 
- **Operative plan**: This is the operation plan if the patient is to undergo an operation procedure. 

- **Patient allergies**: The type of allergies the patient has.

- **Admission Date**: Shows the date the patient was admitted.

- **Discharge Date**: This is shows the date the patient was released from the hospital.

- **Location**: This is where the visit took place.
 
- **Visit type**: Highlights the type of visit the patient did. 

- **Examiner**: This highlights the person who took the patient through during the visit.
 
- **Reason for visit** Write a note why the patient visited the hospital.
 

**Medication**:This is shows you all the current or past medication that has been administered to the patient. It includes the date of medication, name of patient, status of patient, prescription administered , who requested the dose and actions taken. Click on the New visit button to begin. When you click on it a new page is rendered with the following dialogs: 

 
- **Visit**: This is the location of the particular visit.
 
- **Medication**: Highlights the type of medication the patient is given. 
 
- **Prescription**: this is the dose the patient is given and directions on how he will use the medicine.
 
- **Prescription date**:This is where you input the date when the medicine is administered.
 
- **Quantity requested**: This is where you fill in the amount of dosage for a particular medication.
 
- **Refills**: This is number of rounds the dose has been given.

- **Fulfill request now**: This allows the medication to be completed.
 
- **Bill to**: This is whom the bill/amount is charged




**Imaging**: This is allows you to see the particular images the patient has undergone.

**labs**: This allows you to see the labs the patient has visited.

**Social work**: This provides information about the patient's family information.
 

----------
#### 2.2 Patient Listing ####
----------
This is the first sub-menu in this module. When you click on it a new page is rendered with a list of names of all the patients registered by the facility. It shows you the id number of the patients, the first/last names of the patient. The sex of the patient, date of birth, status and actions  with following buttons:

- **Edit**: Allows you to make any changes to the patients details and information.
- **Discharge**: Allows you to officially release an inpatient client.
- **Check In**: Allows you to register a patient when he/she arrives at the hospital.
- **Check out**: Allows you to officially release an outpatient client.

When you click on check in, a new page is rendered with the following dialogs:


- **Name**: Shows the name of the patient.

- **Primary Diagnosis**: This is the location of the particular visit.

- **Operative plan**: Highlights the type of medication the patient is given. 

- **Patient allergies**: The type of allergies the patient has.

- **Admission Date**: Shows the date the patient was admitted.

- **Discharge Date**: This is shows the date the patient was released from the hospital.

- **Location**: This is where the visit took place.
 
- **Visit type**: Highlights the type of visit the patient did. 

- **Examiner**: This highlights the person who took the patient through during the visit.
 
- **Reason for visit** Write a note why the patient visited the hospital.
 
After filling in the above information click on check In. A new page is rendered with the following dialogs:

**Final/billing Diagnosis** This is the diagnosed ailment that the patient will be charged for.

**Order**: This shows any current or past imaging, lab or medication orders processed of the patient.

**Vitals**: Shows the pulse rate, respiratory rate, body temperature, and often blood pressure of a person. Click on new vitals to add the patients vitals. A new page is rendered with the following dialogs:


- **Date recorded**: Records the date of the vitals.

- **Temperature (°C)**: Shows the Recorded temperature of the patient.

- **Weight**: Shows the Recorded weight of the patient.

- **Height**: Shows the Recorded height of the patient. 

- **SBP**: Shows the recorded Systolic Blood Pressure of the patient.

- **DBP**: Shows the recorded Diastolic Blood Pressure of the patient.

- **Heart Rate**: Shows the recorded Heart Rate of the patient.

- **Respiratory Rate**: Shows the recorded Respiratory Rate of the patient.


**Notes**: This shows any current or past Notes written about the patient. You can create a new note here

**procedures**: This shows any current or past Procedures done on the patient. You can create a new procedure here 

**charges**: This shows any current or past charges on the patient. You can add a new item here.

**Reports**: This shows any current or past Reports printed on the patient. You can create a new discharge report here.

----------
#### 2.3 Admitted Patients ####
----------
This is the second sub-menu in this module. When you click on it a new page is rendered with a list of names of all the patients admitted at the facility. It shows you the id number of the patients, the first/last names of the patient, The sex of the patient, date of birth, status and actions  with following buttons:

- **Edit**: Allows you to make any changes to the patients details and information.
- **Discharge**: Allows you to officially release an inpatient client.
- **Delete**: Allows you to remove the patient on the list.
 
----------
#### 2.4 Out-patient ####
----------
This is the third sub-menu in this module. When you click on it a new page is rendered with a list of names of all the outpatients admitted at the facility. It shows you the id number of the patients, the first/last names of the patient, The sex of the patient, the age, Visit type, Time of check in, Appointments, Examiner, Orders done and actions with following buttons:

- **Check out**: Allows you to officially release an outpatient client.

If you want to search for a patient, you can put the date of the visit and location and click on search button.

----------
#### 2.5 Reports ####
----------
This is the last sub-menu in this module. When you click on it a new page is rendered with the following dialogs:

- **Report Type**: Allows you to change the report type.
- **Start Date**: Allows you to put the date when the patient was checked in.
- **End Date**: Allows you to put the date when the patient was checked out.

When you click on generate report, a new page is rendered with details regarding the report.


## 3. SCHEDULING ##
The scheduling module manages all information regarding the appointments of patients visiting the facility.Now we will dive into the specifics of each sub-menu item:

----------
#### 3.1 Add Appointments ####
----------
Although this is the fifth sub-menu this is where you want your entry point to be in a new instance. When you click on it a new page is rendered with the following dialogs:



**Type**: This is where you key in the type of appointment the patient is doing.

**Status**: Shows the position of the appointment at a given time.

**Location**: This is the location of the particular appointment visit.

**With**: Highlights the personnel who will take the patient through. 

**Notes**: Here you can write anything you've noticed about the patient.

**Date**:This is where you input the period or time the appointment is going to last.

----------
#### 3.2  Appointments This Week####
----------
This is the first sub-menu in this module.All information regarding the appointments of patients visiting the facility that week are visible in this sub-menu. Every appointment has following three buttons:

- **Edit**: Here you can edit the appointment of the patient.
 
- **Check-in**: This is registers the patient after arriving at the Hospital .
 
- **Delete** Remove the appointment from the database.

----------
#### 3.3  Today's Appointments####
----------
This is the second sub-menu in this module.All information regarding the appointments of patients visiting the facility that day are visible in this sub-menu. Every appointment has following three buttons:

- **Edit**: Here you can edit the appointment of the patient.
 
- **Check-in**: This is registers the patient after arriving at the Hospital .
 
- **Delete** Remove the appointment from the database.

----------
#### 3.4  Appointments search####
----------
This is the third sub-menu in this module.Here you can search any information regarding the appointments of patients visiting the facility by filtering the using the following dialogs:

**Show appointments on or after**: This is where you input the period or time the appointment is happening or happened .

**Status**: Shows the position of the appointment at a given time.

**Type** This is where you key in the type of appointment the patient is doing.

**With**: Highlights the personnel who will take the patient through. 

- **Search**: Shows the results of the appointment at a given time.

----------
#### 3.5  Appointments calendar####
----------
This is the fourth sub-menu in this module. You can view any scheduled appointments for the day,week or month in this sub-menu. You can also filter the information using the following dialogs:


**Status**: Shows the position of the appointment at a given time.

**Type** This is where you key in the type of appointment the patient is doing.

**With**: Highlights the personnel who will take the patient through. 

**location**: This is where the scheduled appointment is happening or happened .

- **Search**: Shows the results of the appointment at a given time.

----------
#### 3.6  Schedule Theater ####
----------
Although this is the last sub-menu in this module, this is where you want your entry point to be when your are creating your new surgery appointment. When you click on it a new page is rendered with the following dialogs:


**patient**: This is where you key-in the name of the patient.

**Location**: This is the location of the particular appointment visit.

**With**: Highlights the personnel who will take the patient through. 

**Notes**: Here you can write anything you've noticed about the patient.

**Date**:This is where you input the period or time the appointment is going to last.

----------
#### 3.7  Theater Scheduler####
---------- 
This is the sixth sub-menu in this module. You can view any scheduled theaters for the day,week or month in this sub-menu. You can also filter the information using the following dialogs:


**Status**: Shows the position of the appointment at a given time.

**With**: Highlights the personnel who will take the patient through. 

**location**: This is where the scheduled appointment is happening or happened .

- **Clear**: This removes the theater from the schedule at any given time.

- **filter**: This removes any unnecessary information about the theater from the schedule. 

## 4. IMAGING ##

The Imaging module manages all information regarding the visual representations of the interior of a body for clinical analysis and medical intervention, as well as visual representation of the function of some organs or tissues. It interacts with other modules to provide information to other modules such as lab, billing and patients etc. It is only people with permission to view the module who are able to do so.

----------
#### 4.1 New requests ####
----------
Although this is the last sub-menu in this module, this is where you want your entry point to be when your are creating your new requests. When you click on it a new page is rendered with the following dialogs:


**patient**: This is where you key-in the name of the patient.

**Visit**: This is the location of the particular visit.

**Imaging Type**: Highlights the type of imaging the patient will undergo. 

**Notes**: Here you can write anything you've noticed about the patient.

**Result**:This is where you input whether the request is complete, pending or uncompleted.

**Radiologist**Highlights the personnel who will take the patient through. 

----------
#### 4.2 completed ####
----------
This is the second sub-menu in this module, this is where you check your fulfilled requests. 

----------
#### 4.3 Requests ####
----------
This is the first sub-menu in this module, this is where you check if any other department in the Hospital has made any imaging requests. If there is no request you can create a new request by pressing the create a new record button. When you click on it a new page is rendered with dialogs. Refer to **(4.1 New requests)**


## 5. MEDICATION ##

The Imaging module manages all information regarding the visual representations of the interior of a body for clinical analysis and medical intervention, as well as visual representation of the function of some organs or tissues. It interacts with other modules to provide information to other modules such as lab, billing and patients etc. It is only people with permission to view the module who are able to do so.

----------
#### 5.1 New requests ####
----------
Although this is the third sub-menu in this module, this is where you want your entry point to be when your are creating your new requests. When you click on it a new page is rendered with the following dialogs:

**patient**: This is where you key-in the name of the patient.

**Visit**: This is the location of the particular visit.

**Medication**: Highlights the type of medication the patient is given. 

**Prescription**: this is the dose the patient is given and directions on how he will use the medicine.

**Prescription date**:This is where you input the date when the medicine is administered.

**Quantity requested**: This is where you fill in the amount of dosage for a particular medication.

**Refills**: This is number of rounds the dose has been given.

**Fulfill request now**: This allows the medication to be completed.

**Bill to**: This is whom the bill/amount is charged

----------
#### 5.2 completed ####
----------
This is the second sub-menu in this module, this is where you check your fulfilled requests. 

----------
#### 5.3 Requests ####
----------
This is the first sub-menu in this module, this is where you check if any other department in the Hospital has made any medication requests. If there is no request you can create a new request by pressing the create a new record button. When you click on it a new page is rendered with dialogs. Refer to **(5.1 New requests)**

----------
#### 5.4 Dispence ####
----------
This is the fourth sub-menu in this module, this is where you give out medicine to the concerned party. When you click on it a new page is rendered with dialogs. 


**patient**: This is where you key-in the name of the patient.

**Visit**: This is the location of the particular visit.

**Medication**: Highlights the type of medication the patient is given. 

**Prescription**: this is the dose the patient is given and directions on how he will use the medicine.

**Prescription date**:This is where you input the date when the medicine is administered.

**Quantity requested**: This is where you fill in the amount of dosage for a particular medication.

**Refills**: This is number of rounds the dose has been given.

**Bill to**: This is whom the bill/amount is charged

----------
#### 5.5 Return medication ####
----------
This is the last sub-menu in this module, in case wrong medication was given or administered to patient, it can be returned under this sub-menu. When you click on it a new page is rendered with dialogs. 

**patient**: This is where you key-in the name of the patient.

**Visit**: This is the location of the particular visit.

**Medication**: Highlights the type of medication the patient was given. 

**Return Location**: This is the place the medicine is being returned to.

**Return Aisle**:This is exact place where the medication will be returned.

**Quantity To Return**: This is the amount of  medication to be returned.

**Return Reasons/Notes**: This is reason behind the return of the medication.

**Adjustment Date**: This is date the medication is returned.

**credit account to**: This is whom the bill/amount is charged.



## 6. LABS ##
The labs module manages all information regarding the tests that are usually done on clinical specimens in order to obtain information about the health of a patient as pertaining to the diagnosis, treatment, and prevention of disease.. It interacts with other modules to provide information to other modules such as billing and patients etc. It is only people with permission to view the module who are able to do so.

----------
#### 6.1 New requests ####
----------

Although this is the last sub-menu in this module, this is where you want your entry point to be when your are creating your new requests. When you click on it a new page is rendered with the following dialogs:


**patient**: This is where you key-in the name of the patient.

**Visit**: This is the location of the particular visit.

**Lab Type**: Highlights the type of Lab the patient will visit. 

**Notes**: Here you can write anything you've noticed about the patient.

**Result**:This is where you input whether the request is complete, pending or uncompleted.


----------
#### 6.2 completed ####
----------
This is the second sub-menu in this module, this is where you check your fulfilled requests. 

----------
#### 6.3 Requests ####
----------
This is the first sub-menu in this module, this is where you check if any other department in the Hospital has made any imaging requests. If there is no request you can create a new request by pressing the create a new record button. When you click on it a new page is rendered with dialogs. Refer to **(6.1 New requests)**

## 7. BILLING ##

The billing module manages all information regarding the total amount of business or investments within a given period. It interacts with all modules to provide information hospital charges. It is only people with permission to view the module who are able to do so.

----------
#### 7.1 New invoice ####
----------

Although this is the second sub-menu in this module, this is where you want your entry point to be when your are creating your new invoice. When you click on it a new page is rendered with the following dialogs:


**Billed invoice**: This highlights any current or previous invoices. If there is no invoice you can create a new invoice by clicking on new invoice button. When you click on it a new page is rendered with the following dialogs.

- **Bill date**: This is the location of the particular visit.

- **patient**: Highlights the type of Lab the patient will visit. 

- **visit**: Here you can write anything you've noticed about the patient.

- **external invoice**:This is where you input whether the request is complete, pending or uncompleted.

- **payment profile**: This is the location of the particular visit.

- **line items**: Highlights the type of Lab the patient will visit. 
 
- **remarks**: Here you can write anything you've noticed about the patient.

- **payments**:This is where you input whether the request is complete, pending or uncompleted.


**Add Deposit**: a sum payable as a first installment on the purchase of something or as a  balance being payable later.

- **Patient**: Allows you to input the name of the patient.
 
- **Amount**: Allows you to input the amount been deposited.
 
- **Date paid**: Allows you to input the date been paid.

- **Credit to**: Allows you to input the name of the person,facility or department been credited too.

- **notes**: Allows you to record any details.

**Drafted Invoice**: Should not be allocated invoice number. When an invoice is created, it's set to Draft until you send it. If you want to create a drafted invoice use the above steps.

**All invoices**: Records any current or past billed/drafted invoice.

**Paid**: Records all paid invoices. 


----------
#### 7.2 Prices ####
--------
This is the third sub-menu in this module, this is where you input data regarding the prices of different services in the hospital.This includes imaging, lab, procedure and ward pricing.
 When you click on it a new page is rendered with the following dialogs:

- **Name**: Allows you to input the name of the patient.
 
- **Price**: Allows you to input the price of the patient.
 
- **Expense To**: Allows you to input the individual, facility or organization been charged the service.

- **Category**: Allows you to highlight the type of service you are charging for the item. 

- **Add Override**: This feature allows an authorised person to change the automated price of a product or service, in order to apply a discount. 

----------
#### 7.3 Prices profiles ####
----------

This is the Fourth sub-menu in this module, this is where you input data regarding the prices of different services in the hospital Set of costs associated with a specific services. This includes imaging, lab, procedure and ward pricing. When you click on it a new page is rendered with the following dialogs:

- **Name**: Allows you to input the name of the patient.
 
- **Discount Percentage**: Allows you to input the price discount percentage.
 
- **Discount Amount**: Allows you to input the price discount.

- **Set Fee**: Allows you to set the fee for the item. 

## 8. INCIDENT ##
The incident module manages all information regarding an event that is either unpleasant or unusual. It interacts with other modules to provide information to other modules such as billing. It is only people with permission to view the module who are able to do so.

----------
#### 8.1 New Incident ####
----------
Although this is the second sub-menu in this module, this is where you want your entry point to be when your are creating your new incident. When you click on it a new page is rendered with the following dialogs:

**Sentinel Event**: This is any unanticipated event in a health care setting resulting in death or serious physical or psychological injury to a patient or patients, not related to the natural course of the patient's illness

**Date of incident**: This is the date the event happened.

**Department**: This is the department the event happened. 

**Incident Reported to (Full Name)**: The person the event was reported to.

**Category**: This is where you indicate the type of incident.

**Category Item**: Exists primarily to classify incidents in order to provide initial support.

**status**: This is the current position of the incident. 

**Patient Impacted**: The patient the event has occurred to.

**Incident Description**: Here you can write anything about the event.

----------
#### 8.2 Current Incidents ####
----------

This is the first sub-menu in this module, this is where you check a list of your current incidents. You can create a new incident under this sub-menu. Refer to **(8.1 New Incident)**

----------
#### 8.3 History ####
----------

This is the third sub-menu in this module, this is where you any resolved incidents. If there is no incident you can create a new incident by clicking on new incident button. When you click on it a new page is rendered with dialogs. Refer to **(8.1 New Incidents)**

----------
#### 8.4 Reports ####
----------

This is the last sub-menu in this module, this is where you generate reports on any current or past incidents. When you click on it a new page is rendered with the following dialogs:

- **Start Date** Allows you to input the date the incident begun.

- **End Date** Allows you to input the date the incident ended.
 
- **Report Type** Allows you to input the Report type by categorizing the incident by category or Department.

If there is no incident you can create a new incident by clicking on new incident button. When you click on it a new page is rendered with dialogs. Refer to **(8.1 New Incidents)**

## 9. ADMINISTRATION ##

This is the last module in Hospitali plus. When you click on it a new page is rendered with a list of the following sub-menus:

----------
#### 9.1 Address Fields ####
----------

The Address field is a set of text fields where you can enter the address of a location. It has Address labels used to add the delivery address of the recipient, but they can also be used to add other bits of information such as a return address, contact information of the supplier, marketing messages, or an additional greeting.When you click on it a new page is rendered with the following dialogs.

- **Address 1 Label**: Allows you to input the 1 Label. 

- **Address 2 Label**: Allows you to input the 2 Labels. 
 
- **Address 3 Label**: Allows you to input the 3 Labels. 

- **Address 4 Label**: Allows you to input the 4 Labels. 

After you finished filling the address labels, click on update.

----------
#### 9.2 Custom Forms ####
----------

This is a form used to declare the contents of your package in order to pass through the corresponding Customs Agencies that control the the flow of goods in and out of each country.
 You can look up any current or past forms in this sub-menu. 
If there is no custom forms you can create a new form by clicking on the new form button. When you click on it a new page is rendered with the following dialogs.

- **Form name**: Allows you to input the name of the form. 

- **Form type**: Allows you to input the type of the form. 
 
- **columns**: Allows you to input the number of columns. 

- **Always include**: Allows you the information entered to be contained as part of a whole being considered. 

- **Add Field**: Allows you to input the type, columns to span and Labels of the table. 

- **Add**: Allows you to input the information on the database. 
 

----------
#### 9.3 Incident categories ####
----------

Allow you to select through various categories of incidents. If there is no incident categories, you can create a new category by clicking on the new category button. When you click on it a new page is rendered with the following dialogs.


**Incident Category Name**: Allows you to input the category name of the incident.

**Incident Category Item**: ********* 




----------
#### 9.4 Load DB ####
----------

Allows you to upload files into a database.

----------
#### 9.5 lookup lists ####
----------

The Lookup List is a collection of common names, places, or other types of information that can help you decipher a field. When you click on it a new page is rendered with the following dialogs.

 

- **Anesthesia Types**: Allows you to input different kinds of Anesthesia. 

- **Anesthesiologists**: Allows you to input a list of Anesthesiologist Physicians.

- **Billing Categories**: Allows you to input different kinds of Anesthesia.

- **Clinic Locations**: Allows you to input different clinic locations. 

- **Countries**:  Allows you to input different countries.

- **Diagnoses**: Allows you to input different kinds of diagnosis.

- **CPT Codes**: Allows you to input codes that are used to report medical, surgical, and diagnostic procedures and services to entities such as physicians, health insurance companies and accreditation organizations. 

- **Expense Accounts**: Allows you to input different kinds of Anesthesia. 

- **Inventory Aisle Locations**: Allows you to input different inventory aisle locations. 

- **Inventory Locations**: Allows you to input different inventory locations. 

- **Incident Departments**: Allows you to input different incident department. 

- **Inventory Types**:Allows you to input different types of inventory. 

- **Imaging Pricing Types**: Allows you to input different types of imaging. 

- **Lab Pricing Types**: Allows you to input different types of lab pricing.

- **Patient Status List**: Allows you to input patient status list. 

- **Physicians**: Allows you to input different kinds of physicians. 

- **Procedures**:  Allows you to input different kinds of procedures. 

- **Procedures Locations**: Allows you to input different kinds of procedure locations. 

- **Procedure Pricing Types**: Allows you to input different types of procedure pricing. 

- **Radiologists**: Allows you to input different radiologists list. 

- **Sex**: Allows you to input different kinds of sex.

- **Unit Types**: Allows you to input different unit types. 

- **Vendor**: Allows you to input different kinds of Anesthesia. 

- **Visit Locations**: Allows you to input different visit locations.

- **Visit Types**:  Allows you to input different kinds of visit types. 

- **Ward Pricing Types**: Allows you to input different types of ward pricing.

----------
#### 9.6 Shortcodes ####
----------
These shortcuts allow you to replace a short sequence of characters with a longer phrase.that lets you do nifty things with very little effort. Shortcodes can embed files or create objects that would normally require lots of complicated, ugly code in just one line. Shortcode = shortcut.

Fill in the codes in the Create a new shortcode dialog box. Here you write the text you want to replace with the code and then press add.

----------
#### 9.7 Print Header ####
----------

The print header is a set of text fields where you can enter Your header options.When you click on it a new page is rendered with the following dialogs.

- **Facility Name**: Allows you to input the name of the facility. 

- **Header Line 1**: Allows you to input your first header. 
 
- **Header Line 2**: Allows you to input your second header.

- **Header Line 3**: Allows you to input your third header.
 
- **Logo URL**: Allows you to input the url for the logo. 


After you finished filling the text field, click on update.



----------
#### 9.8 Users ####
----------
The User List displays a list of users, based on their group membership.
You also have the ability to create a new user.

----------
#### 9.9 New User ####
----------

All Users must first get authorization before using the Hospitali plus. Please fill-in the form below. By completing this registration process, you will establish a User ID and password that will provide you access to Hospitali plus services. 

----------
#### 9.1.1 User Roles ####
----------

A user role defines permissions for users to perform a group of tasks. In a default Hospitali plus installation there are some predefined roles with a predefined set of permissions. 

This is the sub-menu that allows you to change user roles. 
After doing changes to the user roles, click on update to save the changes.