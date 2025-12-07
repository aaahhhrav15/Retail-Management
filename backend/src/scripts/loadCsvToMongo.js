import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import connectDB from '../utils/database.js';
import Transaction from '../models/Transaction.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to CSV file (adjust if CSV is in a different location)
const CSV_FILE_PATH = path.join(__dirname, '../../../truestate_assignment_dataset.csv');

async function loadCsvToMongo() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB successfully');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing transactions...');
    const deleteResult = await Transaction.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing transactions`);

    const transactions = [];
    let batchCount = 0;
    const BATCH_SIZE = 1000; // Insert in batches for better performance

    console.log(`Reading CSV file: ${CSV_FILE_PATH}`);
    console.log('This may take a while for large files...');

    return new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', async (row) => {
          try {
            // Parse tags from comma-separated string to array
            const tags = row.Tags ? row.Tags.split(',').map(tag => tag.trim()) : [];

            const transaction = {
              transactionId: parseInt(row['Transaction ID']),
              date: new Date(row.Date),
              customerId: row['Customer ID'],
              customerName: row['Customer Name'],
              phoneNumber: row['Phone Number'],
              gender: row.Gender,
              age: parseInt(row.Age),
              customerRegion: row['Customer Region'],
              customerType: row['Customer Type'],
              productId: row['Product ID'],
              productName: row['Product Name'],
              brand: row.Brand,
              productCategory: row['Product Category'],
              tags: tags,
              quantity: parseInt(row.Quantity),
              pricePerUnit: parseFloat(row['Price per Unit']),
              discountPercentage: parseFloat(row['Discount Percentage']),
              totalAmount: parseFloat(row['Total Amount']),
              finalAmount: parseFloat(row['Final Amount']),
              paymentMethod: row['Payment Method'],
              orderStatus: row['Order Status'],
              deliveryType: row['Delivery Type'],
              storeId: row['Store ID'],
              storeLocation: row['Store Location'],
              salespersonId: row['Salesperson ID'],
              employeeName: row['Employee Name']
            };

            transactions.push(transaction);

            // Insert in batches
            if (transactions.length >= BATCH_SIZE) {
              const batch = transactions.splice(0, BATCH_SIZE);
              try {
                await Transaction.insertMany(batch, { ordered: false });
                batchCount += batch.length;
                console.log(`Inserted batch: ${batchCount} transactions processed...`);
              } catch (error) {
                // Handle duplicate key errors gracefully
                if (error.code !== 11000) {
                  console.error('Error inserting batch:', error.message);
                }
              }
            }
          } catch (error) {
            console.error('Error processing row:', error.message, row);
          }
        })
        .on('end', async () => {
          try {
            // Insert remaining transactions
            if (transactions.length > 0) {
              await Transaction.insertMany(transactions, { ordered: false });
              batchCount += transactions.length;
              console.log(`Inserted final batch: ${batchCount} transactions processed`);
            }

            const totalCount = await Transaction.countDocuments();
            console.log('\n========================================');
            console.log('Data loading completed successfully!');
            console.log(`Total transactions in database: ${totalCount}`);
            console.log('========================================\n');

            process.exit(0);
          } catch (error) {
            console.error('Error inserting final batch:', error);
            process.exit(1);
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          reject(error);
          process.exit(1);
        });
    });
  } catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
  }
}

// Run the script
loadCsvToMongo();

