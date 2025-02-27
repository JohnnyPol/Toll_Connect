# **se2417 CLI Tool**
**se2417** is a command-line tool for interacting with the **Toll Operator System API**.  
It allows operators and administrators to manage toll stations, analyze pass transactions, and retrieve reports.

## **📌 Table of Contents**
- [Installation](#️-installation)
- [Usage](#-usage)
- [Authentication](#-authentication)
- [Available Commands](#-available-commands)
- [Admin Commands](#-admin-commands)
- [Examples](#-examples)
- [Running Tests](#-running-tests)

---

## **⚙️ Installation**
### **1️⃣ Install Deno (if not installed)**
The CLI runs on **Deno**, so ensure you have it installed:  
```sh
# Install Deno (Linux/macOS)
curl -fsSL https://deno.land/install.sh | sh

# Install Deno (Windows - PowerShell)
irm https://deno.land/install.ps1 | iex
```

Verify installation:

```sh
deno --version
```

### **2️⃣ Clone the Repository**

git clone https://github.com/your-repo/softeng24-17.git
cd softeng24-17/cli-client

### **3️⃣ Grant Permissions & Compile**
```sh
deno task compile
```
This will create an executable file named se2417.

## **🚀 Usage**

Run the CLI by using:
```sh
./se2417 [command] [options]
```
For help:
```sh
./se2417 --help
```
## **🔑 Authentication**

Before using most commands, you must log in.
### **🔹 Login**
```sh
./se2417 login --username <your_username> --passw <your_password>
```
This stores a token in a local file.<br>
Required for all commands except --help and logout.

### **🔹 Logout**
```sh
./se2417 logout
```
Removes the authentication token.

## **📌 Available Commands**
| **Command**          | **Description**                                         |
|----------------------|---------------------------------------------------------|
| `login`             | Authenticate and retrieve a token.                      |
| `logout`            | Remove authentication token.                            |
| `tollstationpasses` | Retrieve pass records for a toll station.               |
| `chargesby`         | Get pass charges by a specific operator.                |
| `passescost`        | Analyze pass cost for an operator.                      |
| `passanalysis`      | Perform an analysis of pass transactions.               |
| `admin`             | Perform administrative actions (reset data, add passes, etc.). |
| `healthcheck`       | Check API system status.                                |
| `listusers`         | List all toll operators.                                |

For command-specific help:
```sh
./se2417 <command> --help
```
## **📌 Admin Commands**
| **Command**                                  | **Description**                                |
|----------------------------------------------|------------------------------------------------|
| `admin --resetstations`                     | Reset station database with default data.      |
| `admin --resetpasses`                       | Clear all pass data.                           |
| `admin --addpasses --source <file>`         | Upload passes from a CSV file.                |
| `admin --usermod --username <user> --passw <newpass>` | Change a user's password.          |
| `admin --users`                              | List all registered users.                    |


## **📌 Examples**
### **🔹 Fetch Pass Records**
```sh
./se2417 tollstationpasses --station AM08 --from 20240101 --to 20240131 --format json
```
### **🔹 Get Pass Charges by Operator**
```sh
./se2417 chargesby --opid EG --from 20240101 --to 20240131
```
### **🔹 Perform a Pass Analysis**
```sh
./se2417 passanalysis --opid AM --from 20240101 --to 20240131
```
### **🔹 Reset Pass Data (Admin)**
```sh
./se2417 admin --resetpasses
```
### **🔹 Upload a Pass CSV (Admin)**
```sh
./se2417 admin --addpasses --source passes-sample.csv
```
## **🛠 Running Tests**

To run unit tests:
```sh
deno test --allow-read --allow-write --allow-net
```

🚀 Now You're Ready to Use se2417! 🎉


---


