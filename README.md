# **🚗 Toll Management System - Toll Connect**
*Interoperable Toll Management & Data Analysis System*


📜 Table of Contents
- [Introduction](#introduction)
- [Installation and Setup](#installation-and-setup)
  - [Prerequisites](#prerequisites) (here we show the tech stack)
  - [Backend Setup](#Backend)
  - [Frontend Setup](#Frontend)
  - [CLI Setup](#CLI)
- [Usage](#usage)
  - [Running the App](#running-the-app)
- [API Documentation](#API-Documentation)
- [Testing](#Testing)
- [Contributors](#contributors)
---

## 📝 Introduction
Toll Connect is a software system for toll interoperability, managing transactions between different toll operators, calculating settlements, and analyzing toll usage data. The system consists of:
- A backend with a REST API for handling toll transactions and interoperability.
- A frontend (web interface) for data visualization and analysis.
- A CLI tool for administrators to manage toll transactions and view reports.
This system ensures interoperability between toll operators, allowing seamless transactions and automated cost settlements.

Full Documentation: ...

## ⚙ Installation
1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/softeng24-17.git
cd softeng24-17
```
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

Documentation for CLI: Link to readme of cli


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
- [Angelii Ntalapera](https://github.com/...)
- [Dimitris Balatos](https://github.com/...)

