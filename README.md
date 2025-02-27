<<<<<<< HEAD
# Toll_Connect
Interoperable Toll Management &amp; Data Analysis System
=======
# **🚗 Toll Management System - Toll Connect**
*Interoperable Toll Management & Data Analysis System*


📜 Table of Contents
- [Introduction](#introduction)
- [Installation and Setup](#installation-and-setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [CLI Setup](#cli-setup)
- [Usage](#usage)
  - [Running the App](#running-the-app)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributors](#contributors)
---

## 📝 Introduction
Toll Connect is a **software system for toll interoperability**, managing transactions between different toll operators, calculating settlements, and analyzing toll usage data.  

The system consists of:  
- **Backend**: REST API for handling toll transactions and interoperability.  
- **Frontend**: Web interface for data visualization and analysis.  
- **CLI Tool**: Administrator utility for managing toll transactions and viewing reports.  


📄 **Full Documentation SRS**: [here](https://github.com/ntua/softeng24-17/blob/main/documentation/SRS%20softeng24-17.docx)

## ⚙ Installation and Setup 
1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/softeng24-17.git
cd softeng24-17
```
...
---

## 🚀 Running the Project
### Backend Setup
Start the backend server:
```
cd back-end
deno ...
```
The API will be available at:
📌 http://localhost:9115/api

### Frontend Setup
Run the web application:
```sh
cd front-end
deno ...
```
Access it at: 🌍 http://localhost:3000

### CLI Setup
Compile the CLI tool:
```
cd cli-client
deno task compile
./se2417 --help
```

Documentation for CLI: [here](https://github.com/ntua/softeng24-17/blob/main/cli-client/README.md)

## Dockerized Version
To run the entire system's services with docker-compose execute the following at the root of the project:
```
docker compose build
docker compose up -d
```

The API is exposed on port 9115 and the frontend is served by apache on port 80

## 📜 API Documentation
The full API reference is available at:
📌 http://localhost:9115/api/docs

API documentation is provided in:
✔ OpenAPI 3.0 (YAML / JSON)
✔ Postman Collection


## 🧪 Testing
To run unit tests:
```
cd cli-client
deno test --allow-read --allow-write --allow-net
```

## 👨‍💻 Contributors
- [Giorgos Karapidakis](https://github.com/...)
- [Giorgos Doudounakis](https://github.com/...)
- [Giannis Polychornopoulos](https://github.com/JohnnyPol)
- [Katerina Michou](https://github.com/...)
- [Angeliki Ntalapera](https://github.com/...)
- [Dimitris Balatos](https://github.com/...)

>>>>>>> r1remote/main
